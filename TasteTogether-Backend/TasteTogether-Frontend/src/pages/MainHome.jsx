import { Link } from 'react-router-dom'
import Post from '../components/Post'
import { useState, useEffect } from 'react'
import Client from '../services/api'
import UsersSearchBar from '../components/UsersSearchBar'
import { Box, HStack, IconButton, Stack } from '@chakra-ui/react'
import RoomSidebar from '../components/RoomSidebar'
import { FaPlus } from 'react-icons/fa'

import { useNavigate } from 'react-router-dom'
const MainHome = ({ user }) => {
  const [newPosts, setNewPosts] = useState([])
  let navigate = useNavigate()
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await Client.get('/posts')
        setNewPosts(response.data)
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    }

    fetchPosts()
  }, [])
  if (!user) {
    // show message if user is not signed in
    return (
      <div>
        <h3>Oops! You must be signed in to see your posts!</h3>
        <button onClick={() => navigate('/signin')}>Sign In</button>
      </div>
    )
  }

return (
  <Box
    px={{ base: 4, md: 8 }}
    py={6}
    pb="90px"
    pr={{ base: 4, lg: '50px' }}
    position="relative"
  >
    <HStack
      mb={6}
      spacing={3}
      align="center"
      justify="space-between"
      flexWrap="wrap"
    >
      <Box flex="1" minW={{ base: '100%', md: '420px' }}>
        <UsersSearchBar />
      </Box>
    </HStack>

    <Stack spacing={6}>
      {newPosts.map((post) => (
        <Post key={post._id} post={post} user={user} />
      ))}
    </Stack>

    <IconButton
      as={Link}
      to="/new"
      aria-label="Add a New Post"
      position="fixed"
      right="24px"
      bottom="24px"
      w="50px"
      h="50px"
      p={0}
      borderRadius="full"
      bg="gray.900"
      color="white"
      boxShadow="lg"
      display="flex"
      alignItems="center"
      justifyContent="center"
      _hover={{ bg: 'gray.800' }}
      zIndex={1000}
    >
      <FaPlus style={{ width: '16px', height: '16px' }} />
    </IconButton>

    <Box
      display={{ base: 'none', lg: 'block' }}
      position="fixed"
      top="90px"
      right="24px"
      w="340px"
      zIndex={900}
    >
      {user && <RoomSidebar user={user} />}
    </Box>
  </Box>
)

}

export default MainHome
