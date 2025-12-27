import { useNavigate } from 'react-router-dom'
import {
  Home,
  UtensilsCrossed,
  BookOpen,
  User,
  Users,
  LogOut,
  Laptop
} from 'lucide-react'
import { Box, Avatar } from '@chakra-ui/react'
import Dock from './Dock'
import { BASE_URL } from '../services/api'

const Sidebar = ({ handleLogOut, user }) => {
  if (!user) return null

  const navigate = useNavigate()

  const goToProfile = () => {
    //check if the user exist and have id
    if (user && (user._id || user.id)) {
      const userId = user._id || user.id
      //navigate to user profile page
      navigate(`/profile/${userId}`)
    }
  }

  const logout = () => {
    handleLogOut()
    navigate('/signin')
  }

  const items = [
    { to: '/main', icon: <Home size={18} />, label: 'Home', exact: true },
    {
      to: '/restaurants',
      icon: <UtensilsCrossed size={18} />,
      label: 'Restaurants'
    },
    { to: '/recipes', icon: <BookOpen size={18} />, label: 'Recipes' },
    { to: '/user/recipes', icon: <User size={18} />, label: 'Users Recipes' },
    { to: '/users', icon: <Users size={18} />, label: 'Users' },
    {
      to: '/rooms',
      icon: <Laptop size={18} />,
      label: 'Rooms',
      action: 'rooms'
    },
    { icon: <LogOut size={18} />, label: 'Sign Out', onClick: logout }
  ]

  return (
    <>
      <Box
        position="fixed"
        top="20px"
        left="20px"
        zIndex="1000"
        cursor="pointer"
        onClick={goToProfile}
        transition="all 0.2s ease"
        _hover={{
          transform: 'scale(1.5)'
        }}
      >
        <Avatar.Root size="sm" shape="full">
          <Avatar.Fallback>
            {user.username?.[0]?.toUpperCase() || 'U'}
          </Avatar.Fallback>
          {user.image && (
            <Avatar.Image src={`${BASE_URL}/uploads/${user.image}`} />
          )}
        </Avatar.Root>
      </Box>

      <Dock
        items={items}
        panelHeight={64}
        baseItemSize={44}
        magnification={62}
      />
    </>
  )
}

export default Sidebar
