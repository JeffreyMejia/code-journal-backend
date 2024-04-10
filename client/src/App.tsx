import { Route, Routes } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { EntryForm } from './pages/EntryForm';
import { EntryList } from './pages/EntryList';
import { NotFound } from './pages/NotFound';
import './App.css';
import { AuthPage } from './pages/AuthPage';
import { Home } from './pages/Home';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<NavBar />}>
        <Route index element={<Home />} />
        <Route path="entry-list" element={<EntryList />} />
        <Route path="details/:entryId" element={<EntryForm />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/sign-up" element={<AuthPage mode="sign-up" />} />
        <Route path="/sign-in" element={<AuthPage mode="sign-in" />} />
      </Route>
    </Routes>
  );
}
