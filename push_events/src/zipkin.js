import zipkin from 'zipkin';
import {Tracer, ExplicitContext, BatchRecorder} from 'zipkin';
import {HttpLogger} from 'zipkin-transport-http';
import expMiddleware from 'zipkin-instrumentation-express';

const JsonEncoder = zipkin.jsonEncoder.JSON_V2;
const zipkinMiddleware = expMiddleware.expressMiddleware;
const ctxImpl = new ExplicitContext();
const zipkinEndpointHost = process.env.MOTI_ZIPKIN_HOST || 'localhost'
const recorder = new BatchRecorder({
    logger: new HttpLogger({
        jsonEncoder: JsonEncoder
        , endpoint: `http://${zipkinEndpointHost}:9411/api/v2/spans`
    })
});
const localServiceName = 'event-push-server-v1'; // name of this application

const tracer = new Tracer({ctxImpl, recorder, localServiceName});
const ZipkinTracerMiddleware = zipkinMiddleware({tracer});

export {ZipkinTracerMiddleware};