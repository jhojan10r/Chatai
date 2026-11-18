import { createBrowserRouter } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import HomePage from '@/pages/Home';
import ExplorePage from '@/pages/Explore';
import CharacterPage from '@/pages/Character';
import ChatPage from '@/pages/Chat';
import ProfilePage from '@/pages/Profile';
import CreateCharacterPage from '@/pages/CreateCharacter';
import NotFoundPage from '@/pages/NotFound';

export const router = createBrowserRouter([
  {
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/explore', element: <ExplorePage /> },
      { path: '/character/:id', element: <CharacterPage /> },
      { path: '/chat/:id', element: <ChatPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/create-character', element: <CreateCharacterPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
