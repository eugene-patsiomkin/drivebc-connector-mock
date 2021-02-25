package org.moti.events.models.weather_canada;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.Getter;

@JacksonXmlRootElement
@JsonIgnoreProperties
@Getter
public class Site {
    @JacksonXmlProperty(namespace = "code", isAttribute = true)
    private String code;
    @JacksonXmlProperty(namespace = "nameEn")
    private String nameEn;
    @JacksonXmlProperty(namespace = "nameFr")
    private String nameFr;
    @JacksonXmlProperty(namespace = "provinceCode")
    private String provinceCode;

    @Override
    public String toString() {
        return "Site{" +
                "code='" + code + '\'' +
                ", nameEn='" + nameEn + '\'' +
                ", nameFr='" + nameFr + '\'' +
                ", provinceCode='" + provinceCode + '\'' +
                '}';
    }
}
