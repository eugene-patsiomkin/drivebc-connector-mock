import App from "./App/app";
import GetServiceObject from "./App/helpers/service";

const Index = (props) => (
    <App {... props}/>
)

export default Index

export async function getServerSideProps() {

    const res = await fetch(`http://localhost:8001/services?tags=type~docs`)
    const data = await res.json()
  
    if (!data) {
      return {
        notFound: true,
      }
    }

    let services = [];

    data.data.forEach(service => {
        services.push(GetServiceObject(service));
    });

    return {
        props: {
            services: services
        }
    }
}
  