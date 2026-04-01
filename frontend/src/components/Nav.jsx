import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

export default function Nav() {
    return(
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="#home">Bank Statement Analyzer</Navbar.Brand>
            </Container>
            <Container className="d-flex justify-content-end">
                <Navbar.Brand href="#home">UserName</Navbar.Brand>
            </Container>
        </Navbar>
    )
}
