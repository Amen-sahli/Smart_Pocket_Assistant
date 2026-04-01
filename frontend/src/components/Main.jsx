import React from 'react';
import { Container, Button } from 'react-bootstrap';

export default function Main() {
    return(
        <div className="d-flex flex-column text-white " style={{ minHeight: '100vh' }}>
            <h1 className='display-4 align-self-center mt-5' >Welcome to the Dashboard</h1>
            <div className='d-flex flex-column align-items-center mt-5' style={{flex:1}}>
                <p>Upload your bank statements to get started.</p>
                <input type="file" name="file" id="fileInput"  className='form-control w-50 align-self-center d-inline'/>
            </div>
            <section className='d-flex flex-wrap justify-content-around mt-4' style={{flex:1}}>
                <div className='bg-dark text-white p-4 mt-4' style={{width:'400px', height: '250px',textAlign:'center',}}>Chart here</div>
                <div className='bg-dark text-white p-4 mt-4' style={{width:'400px', height: '250px',textAlign:'center',}}>Chart 2 here</div>
                <div className='bg-dark text-white p-4 mt-4' style={{width:'400px', height: '250px',textAlign:'center',}}>Table here</div>
            </section>
            
            
        </div>
    )
}