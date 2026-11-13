import Dashboard from "../components/Dashboard";
import { Container, Center, Box } from "@mantine/core"; 

function TradingView() {

    return (
        <>
            <Container fluid h={800}> 
                <Dashboard />
            </Container>
        </>
    )
}

export default TradingView; 