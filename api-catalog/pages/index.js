import App from "./App/app";

const Index = (props) => (
    <App {... props}/>
)

export default Index

export async function getServerSideProps() {

    const res = await fetch(`http://localhost:8001/services`)
    const data = await res.json()
  
    if (!data) {
      return {
        notFound: true,
      }
    }

    let services = [];

    data.data.forEach(service => {
        services.push({
            "name" : `${service.name}`,
            "meta" : `${service.tags}`,
            "description" : `service endpoint: ${service.host}, service port:${service.port}, protocol: ${service.protocol}`,
            "document_link" : "http://google.com",
            "get_api_key_link" : "http://google.com"
        });
    });

    return {
        props: {
            services: services
        }
    }
}
  