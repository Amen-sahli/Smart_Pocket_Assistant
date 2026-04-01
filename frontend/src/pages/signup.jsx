import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import { Link } from 'react-router-dom'


export default function Signup() {


    return(
        <form  className="d-flex flex-column align-items-center justify-content-center text-white" style={{ minHeight: '100vh' }}>
            <h1>Signup</h1>
            <p className='margin-bottom-5'>Welcome to the signup page!</p>
            <div >
                <label htmlFor="username">Username :</label>
                <input type="text" id="username" name="username" placeholder="Enter your username" style={{width:'250px', display:'block', border:'1px  solid #ced4da', borderRadius:'0.375rem', height:'40px'}} />
            </div>
            <div className="mt-3">
                <label htmlFor="email">Email :</label>
                <input type="email" id="email" name="email" placeholder="example@example.com" style={{width:'250px', display:'block', border:'1px  solid #ced4da', borderRadius:'0.375rem', height:'40px'}} />
            </div>
            <div className="mt-3 mb-3">
                <label htmlFor="password">Password :</label>
                <input type="password" id="password" name="password" placeholder="********" style={{width:'250px', display:'block', border:'1px  solid #ced4da', borderRadius:'0.375rem', height:'40px'}} />
                <label htmlFor="confirmPassword" className='mt-3'>Confirm Password :</label>
                <input type="password" id="confirmPassword" name="confirmPassword" placeholder="********" style={{width:'250px', display:'block', border:'1px  solid #ced4da', borderRadius:'0.375rem', height:'40px'}} />
            </div>
            <Link to="/dashboard" className="text-decoration-none" style={{ width: '15%', minWidth: '150px' }}>
                <Button variant="primary" type="submit" className="mt-3 w-100">
                    Signup
                </Button>
            </Link>
            <p className='mt-4'>Already have an account? <Link to="/" className="text-decoration-underline">Login here</Link></p>
        </form>
    )
}