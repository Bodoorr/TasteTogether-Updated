import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Client from '../services/api'
import { BASE_URL } from '../services/api'
import { Input, Box, Stack, HStack, Avatar, Text } from '@chakra-ui/react'

const UsersSearchBar = () => {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredUsers, setFilteredUsers] = useState([])

  useEffect(() => {
    const Users = async () => {
      try {
        //axios call to get all the users
        const response = await Client.get('/users')
        //set the users from the response
        setUsers(response.data)
        //to hide all the users
        setFilteredUsers([])
      } catch (error) {
        throw error
      }
    }
    Users()
  }, [])

  //to handle input  changes in the searchbar
  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    //if the input empty clear the filtered list
    if (value.trim() === '') {
      setFilteredUsers([])
    } else {
      //else filter the users whose username included in the search
      const filtered = users.filter((user) =>
        user.username.toLowerCase().includes(value.toLowerCase())
      )
      //set the filtered users with the filtered list
      setFilteredUsers(filtered)
    }
  }

  return (
    <Box w="100%" maxW="420px" mx="auto">
      <Input
        placeholder="Search for user..."
        value={searchTerm}
        onChange={handleSearch}
        borderRadius="full"
        size="md"
        mb={4}
        mt={6}
        px={4}
        boxShadow="sm"
        _focus={{
          borderColor: 'teal.400',
          boxShadow: '0 0 0 1px teal'
        }}
      />

      <Stack spacing={3}>
        {filteredUsers.map((user) => (
          <Box
            key={user._id}
            as={Link}
            to={`/profile/${user._id}`}
            p={3}
            borderRadius="lg"
            bg="gray.50"
            _hover={{ bg: 'gray.100' }}
            boxShadow="sm"
            display="block"
            transition="0.2s"
          >
            <HStack spacing={3}>
              <Avatar.Root
                size="sm"
                shape="full"
                style={{
                  borderRadius: '50%',
                  overflow: 'hidden'
                }}
              >
                <Avatar.Fallback style={{ borderRadius: '50%' }} bg="gray.300">
                  {user.username?.[0]?.toUpperCase() || 'U'}
                </Avatar.Fallback>

                {user.image && (
                  <Avatar.Image
                    src={`${BASE_URL}/uploads/${user.image}`}
                    style={{ borderRadius: '50%' }}
                  />
                )}
              </Avatar.Root>

              <Text fontWeight="medium" color="black">
                {user.username}
              </Text>
            </HStack>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}
export default UsersSearchBar
