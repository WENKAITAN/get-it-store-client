import React, { useState, useEffect, createContext } from 'react'

const AuthContext = createContext();
const { Provider } = AuthContext;


const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(false)

  useEffect(() => {
    fetch('https://get-it-store-backend.herokuapp.com/api/auth/login')
      .then(response => {
        if(!response.ok) {
          throw new Error('Unauthenticated')
        }

        return response.json();
      })
      .then(body => setUser(body))
      .catch(err => setUser(false))
  }, [])

  const authenticate = (email, password) => {
    return fetch('https://get-it-store-backend.herokuapp.com/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((response) => {
        if(!response.ok) {
          throw new Error('Login Failed');
        }

        return response.json();
      })
      .then((body) => {
        localStorage.id = body.email
        setUser(body);
        return body;
      });
  }

  const signup = (email, password) => {
    return fetch('https://get-it-store-backend.herokuapp.com/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(response => {
      if(!response.ok) {
        throw new Error('Signup Failed');
      }
      return response.json();
    }).then((user) => {
      localStorage.clear()
      localStorage.id = user.email
      setUser(user)
      return user;
    })
  }

  const signout = () => {
    return fetch('https://get-it-store-backend.herokuapp.com/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((response) => {
        if(!response.ok) {
          throw new Error('Logout Failed');
        }

        return response.json();
      })
      .then((body) => {
        localStorage.removeItem("id")
        setUser(false)
        return body;
      });
  }

  return (
    <Provider
      value={{
        authenticate,
        signout,
        isAuthenticated: user&&localStorage.getItem("id") ? true : false,
        signup,
        user
      }}
    >
      { children }
    </Provider>
  )
}

export { AuthContext, AuthProvider };