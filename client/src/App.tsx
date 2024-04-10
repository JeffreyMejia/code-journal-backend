import { Route, Routes } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { EntryForm } from './pages/EntryForm';
import { EntryList } from './pages/EntryList';
import { NotFound } from './pages/NotFound';
import './App.css';
import { AuthPage } from './pages/AuthPage';
import { User, UserProvider } from './components/UserContext';
import { saveToken } from './data';
import { Home } from './pages/Home';
import { useState } from 'react';

export default function App() {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>();

  console.log('user', user);
  console.log('token', token);

  function handleSignIn(user: User, token: string) {
    setUser(user);
    setToken(token);
    saveToken(token);
  }

  function handleSignOut() {
    console.log('logged out!');
    setUser(undefined);
    setToken(undefined);
    saveToken(undefined);
  }
  const contextValue = { user, token, handleSignIn, handleSignOut };
  return (
    <UserProvider value={contextValue}>
      <Routes>
        <Route path="/" element={<NavBar />}>
          <Route index element={<Home />} />
          <Route path="entry-list" element={<EntryList />} />
          <Route path="details/:entryId" element={<EntryForm />} />
          <Route path="sign-up" element={<AuthPage mode="sign-up" />} />
          <Route path="sign-in" element={<AuthPage mode="sign-in" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </UserProvider>
  );
}
