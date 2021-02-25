package org.moti.events;

import org.apache.camel.Exchange;
import org.apache.camel.LoggingLevel;
import org.apache.camel.Predicate;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.ehcache.EhcacheConstants;
import org.apache.camel.component.jacksonxml.ListJacksonXMLDataFormat;
import org.moti.events.models.weather_canada.Site;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

import static org.apache.camel.support.builder.PredicateBuilder.and;
import static org.apache.camel.support.builder.PredicateBuilder.not;

/**
 * A simple Camel route that triggers from a timer and calls a bean and prints to system out.
 * <p/>
 * Use <tt>@Component</tt> to make Camel auto detect this route when starting.
 */
@Component
public class MotiWeatherCanadaRouter extends RouteBuilder {
    @Autowired
    private Environment env;

   @Override
    public void configure() {

        ListJacksonXMLDataFormat cityPageWeather = new ListJacksonXMLDataFormat(Site.class);

//        from("rabbitmq:xpublic?queue=q_anonymous.sr_subscribe.citypage.moti_bc&routingKey=citypage_weather.#")
//            .routeId("Super cool AMQP route is here")
//            .to("file://c:/wc-data?fileName=${date:now:yyyyMMddHHmmssSSS}.${id}.out");

//        getContext().getGlobalOptions().put("http.proxyHost", "kamproxy.corp.advancedsolutions.eds.com");
//        getContext().getGlobalOptions().put("http.proxyPort", "8080");


        Predicate GotResult = header("CamelEhcacheActionHasResult").isEqualTo(true);
//        Every hour
//        from("timer:GetWeatherInfo?period=3600000").routeId("Get weather list")
        from("timer:GetWeatherInfo?period=10000").routeId("Get weather info")
            // Setting up constants
            .setHeader("CITY_LIST_CACHE_KEY", constant("CITY_LIST_CACHE_KEY"))
            .setHeader("CITY_LIST_CACHE", constant("CITY_LIST_CACHE"))
            .setHeader("CITY_CACHE_KEY_PREFIX", constant("CITY_CACHE_KEY_PREFIX_"))
            .setHeader("CITY_CACHE", constant("CITY_CACHE"))
            // -- Setting up constants
            .log(LoggingLevel.INFO, ">".repeat(6) + "Getting City list " + ">".repeat(6))
            .to("direct:getCityList")
            .unmarshal(cityPageWeather)
            .split(body()).stopOnException()//.parallelProcessing()
                .filter(simple("${body.getProvinceCode} == 'BC'"))
                .to("seda:processCity?concurrentConsumers=4")
                .choice()
                    .when(simple("${header.CamelSplitIndex} > 10"))
                        .throwException(new Exception("Enough"))
                    .end()
                .end()
            .end()
            .log(LoggingLevel.INFO, "<".repeat(6) + "Processed whole list" + "<".repeat(6))
        .end();

        from("seda:processCity").routeId("Process city weather")
            .setHeader("CityCode", simple("${body.getCode}"))
            .setHeader("CityProvinceCode", simple("${body.getProvinceCode}"))
            .setHeader("CityNameEn", simple("${body.getNameEn}"))
            .log(LoggingLevel.INFO, ">".repeat(3) + "Getting Weather information for ${header.CityNameEn} [${header.CityCode}] " + ">".repeat(3))
            .to("direct:getBcCityInfo")
            .to("direct:processCityFile")
            .log(LoggingLevel.INFO, "<".repeat(3) + "Information for ${header.CityNameEn} [${header.CityCode}] retrieved " + "<".repeat(3))
        .end();

        from("direct:getCityList").routeId("Get city list")
            .setHeader(EhcacheConstants.ACTION, constant(EhcacheConstants.ACTION_GET))
            .setHeader(EhcacheConstants.KEY, simple("${header.CITY_LIST_CACHE_KEY}"))
            .toD("ehcache:${header.CITY_LIST_CACHE}")
            .choice()
                .when(not(GotResult))
                    .log(LoggingLevel.INFO, "Retrieving city list from Weather Canada")
                    .to("direct:getCityListFromHTTP")
                    .setHeader(EhcacheConstants.ACTION, constant(EhcacheConstants.ACTION_PUT))
                    .setHeader(EhcacheConstants.VALUE, simple("${body}"))
                    .toD("ehcache:${header.CITY_LIST_CACHE}")
                .otherwise()
                    .log(LoggingLevel.INFO, "City list retrieved from cache")
            .end()
        .end();

        from("direct:getCityListFromHTTP").routeId("Getting city list from HTTP")
            .setHeader("Accept", constant("*/*"))
            .setHeader("User-Agent", constant("ApacheCamel"))
            .setHeader("Connection", constant("keep-alive"))
            .setHeader(Exchange.HTTP_METHOD, constant("GET"))
            .to("https://dd.weather.gc.ca/citypage_weather/xml/siteList.xml")
            .convertBodyTo(String.class)
        .end();


        from("direct:getBcCityInfo").routeId("Getting weather info for bc city")
            .throttle(1)//.timePeriodMillis(1000)
            .setHeader(Exchange.HTTP_METHOD, constant("GET"))
            .toD("https://dd.weather.gc.ca/citypage_weather/xml/${header.CityProvinceCode}/${header.CityCode}_e.xml")
            .convertBodyTo(String.class)
            .process(new ChecksumProcessor())
            .log(LoggingLevel.INFO, "Weather information for ${header.CityNameEn} [${header.CityCode}] retrieved from Weather Canada")
        .end();

        from("direct:processCityFile").routeId("Parsing weather file")
            .multicast().aggregationStrategy(new ChecksumAggregationStrategy())
                .to("seda:waitForCheckSum?waitForTaskToComplete=Always", "seda:checkCache?waitForTaskToComplete=Always")
            .end()
            .choice()
                .when(simple("${header.FileExists} == true"))
                    .log(LoggingLevel.INFO, "No new data available for ${header.CityNameEn} [${header.CityCode}]")
                .otherwise()
                    .setHeader("CamelFileName", simple("${header.CityCode}-${header.CityNameEn}/${date:now:yyyy-MM-dd_HHmmssSSS}.${header[CheckSum]}.xml"))
                    .to("file://c:/wc-data")
                    .log(LoggingLevel.INFO, "Weather data for ${header.CityNameEn} [${header.CityCode}] was saved to ${header.CamelFileName}")
            .end()
        .end();

        from("seda:checkCache").routeId("Check city weather cache").setBody(simple(""))
            .setHeader(EhcacheConstants.ACTION, constant(EhcacheConstants.ACTION_GET))
            .setHeader(EhcacheConstants.KEY, simple("${header.CITY_CACHE_KEY_PREFIX}${header.CheckSum}"))
            .toD("ehcache:${header.CITY_CACHE}")
            .setHeader("FileExists", simple("${header.CamelEhcacheActionHasResult} == true && ${header.CheckSum} == ${body}", boolean.class))
            .setHeader(EhcacheConstants.ACTION, constant(EhcacheConstants.ACTION_PUT))
            .setHeader(EhcacheConstants.VALUE, simple("${header[CheckSum]}"))
            .toD("ehcache:${header.CITY_CACHE}")
            .log("Cache check complete result: ${header.FileExists ? 'Exists': 'Does not exist'}")
        .end();

        from("seda:waitForCheckSum").routeId("Waiting for a duplicate checkup")
            .log("Waiting for a file cache record check.")
        .end();
    }
}