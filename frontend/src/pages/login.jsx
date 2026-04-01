import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'


export default function Login() {
    return(
        <Container className="d-flex flex-column align-items-center justify-content-center text-white" style={{ minHeight: '100vh' }}>
            <h1>Login</h1>
            <p className='margin-bottom-5'>Welcome to the login page!</p>
            <div className="mt-3">
                <label htmlFor="email">Email :</label>
                <input type="email" id="email" name="email" placeholder="example@example.com" style={{width:'250px', display:'block', border:'1px  solid #ced4da', borderRadius:'0.375rem', height:'40px'}} />
            </div>
            <div className="mt-3 mb-3">
                <label htmlFor="password">Password :</label>
                <input type="password" id="password" name="password" placeholder="********" style={{width:'250px', display:'block', border:'1px  solid #ced4da', borderRadius:'0.375rem', height:'40px'}} />
            </div>
            <Link to="/dashboard" className="text-decoration-none" style={{ width: '15%', minWidth: '150px' }}>
                <Button variant="primary" type="submit" className="mt-3 w-100">
                    Login
                </Button>
            </Link>
            <p className='mt-4'>Don't have an account? <Link to="/signup" className="text-decoration-underline">Register here</Link></p>
        
        </Container>
    )
}