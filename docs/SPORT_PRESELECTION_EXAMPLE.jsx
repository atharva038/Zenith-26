// Example: How to implement sport preselection in your Registration Page

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function RegisterSports() {
  const location = useLocation();
  const [selectedSport, setSelectedSport] = useState('');
  
  // Extract the preselected sport data from navigation state
  const { preselectedSport, sportId, fromSportsGrid } = location.state || {};

  // Preselect sport when coming from Sports Grid
  useEffect(() => {
    if (fromSportsGrid && preselectedSport) {
      console.log('Preselecting sport:', preselectedSport);
      setSelectedSport(preselectedSport);
      
      // If you have a select dropdown, you can set it like this:
      // const selectElement = document.getElementById('sport-select');
      // if (selectElement) {
      //   selectElement.value = preselectedSport;
      // }
      
      // Or if using a form library like React Hook Form:
      // setValue('sport', preselectedSport);
    }
  }, [fromSportsGrid, preselectedSport]);

  return (
    <div className="registration-page">
      <h1>Sports Registration</h1>
      
      {/* Show message if preselected */}
      {fromSportsGrid && preselectedSport && (
        <div className="alert alert-info">
          You selected: <strong>{preselectedSport}</strong>
        </div>
      )}

      {/* Your registration form */}
      <form>
        <label htmlFor="sport-select">Select Sport:</label>
        <select 
          id="sport-select"
          value={selectedSport}
          onChange={(e) => setSelectedSport(e.target.value)}
          className="form-control"
        >
          <option value="">Choose a sport...</option>
          <option value="FOOTBALL">Football</option>
          <option value="BASKETBALL">Basketball</option>
          <option value="CRICKET">Cricket</option>
          <option value="VOLLEYBALL">Volleyball</option>
          <option value="BADMINTON">Badminton</option>
          <option value="HANDBALL">Handball</option>
          <option value="KABADDI">Kabaddi</option>
          <option value="CHESS">Chess</option>
          <option value="TABLE TENNIS">Table Tennis</option>
          <option value="CARROM">Carrom</option>
          <option value="ATHLETICS">Athletics</option>
          <option value="POWERLIFTING">Powerlifting</option>
        </select>

        {/* Rest of your form fields */}
        <input type="text" placeholder="Team Name" />
        <input type="email" placeholder="Email" />
        {/* ... */}

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterSports;

// ============================================
// ALTERNATIVE: If using React Hook Form
// ============================================

/*
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';

function RegisterSports() {
  const location = useLocation();
  const { register, handleSubmit, setValue } = useForm();
  
  const { preselectedSport, sportId, fromSportsGrid } = location.state || {};

  useEffect(() => {
    if (fromSportsGrid && preselectedSport) {
      // Preselect using React Hook Form
      setValue('sport', preselectedSport);
    }
  }, [fromSportsGrid, preselectedSport, setValue]);

  const onSubmit = (data) => {
    console.log('Registration data:', data);
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <select {...register('sport', { required: true })}>
        <option value="">Choose a sport...</option>
        <option value="FOOTBALL">Football</option>
        // ... other options
      </select>
      
      <input {...register('teamName', { required: true })} />
      <button type="submit">Register</button>
    </form>
  );
}
*/

// ============================================
// ALTERNATIVE: If using Formik
// ============================================

/*
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';

function RegisterSports() {
  const location = useLocation();
  const { preselectedSport, sportId, fromSportsGrid } = location.state || {};

  return (
    <Formik
      initialValues={{
        sport: preselectedSport || '', // Preselect directly in initial values
        teamName: '',
        email: '',
      }}
      onSubmit={(values) => {
        console.log('Registration:', values);
      }}
    >
      <Form>
        {fromSportsGrid && preselectedSport && (
          <div className="alert">Selected: {preselectedSport}</div>
        )}
        
        <Field as="select" name="sport">
          <option value="">Choose a sport...</option>
          <option value="FOOTBALL">Football</option>
          // ... other options
        </Field>
        
        <Field type="text" name="teamName" placeholder="Team Name" />
        <button type="submit">Register</button>
      </Form>
    </Formik>
  );
}
*/
