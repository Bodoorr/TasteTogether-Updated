import Client from '../services/api'
import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { FaRandom } from 'react-icons/fa'
import { Box, Text, Stack, Button, Center, Avatar } from '@chakra-ui/react'
const RandomProfile = () => {
  const [users, setUsers] = useState([])
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await Client.get('/users')
        setUsers(response.data)
      } catch (err) {
        console.error('Failed to fetch users')
      }
    }

    fetchUsers()
  }, [])

  const pickRandom = () => {
    if (users.length > 0) {
      const random = users[Math.floor(Math.random() * users.length)]
      setProfile(random)

      // Fireworks effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }

  return (
    <Center minH="90vh" px={4}>
      <Box
        maxW="420px"
        w="100%"
        p={6}
        borderRadius="2xl"
        boxShadow="md"
        bg="white"
        textAlign="center"
      >
        <Stack spacing={6}>
          <Text fontSize="xl" fontWeight="bold" color="gray.900">
            Random User
          </Text>

          {profile ? (
            <Stack spacing={3} align="center">
              <Avatar.Root size="2xl">
                <Avatar.Image
                  src={profile.image ? profile.image : undefined}
                  alt={profile.username}
                />
                <Avatar.Fallback>
                  {profile.username?.charAt(0).toUpperCase()}
                </Avatar.Fallback>
              </Avatar.Root>

              <Text fontWeight="semibold" fontSize="lg" color="gray.900">
                {profile.username}
              </Text>

              <Text fontSize="sm" color="gray.600">
                {profile.firstName} {profile.lastName}
              </Text>
            </Stack>
          ) : (
            <Box
              p={4}
              bg="gray.50"
              borderRadius="lg"
              border="1px dashed"
              borderColor="gray.200"
            >
              <Text fontSize="sm" color="gray.600">
                No user selected yet. Click below to pick a random profile.
              </Text>
            </Box>
          )}

          <Button
            onClick={pickRandom}
            leftIcon={<FaRandom />}
            borderRadius="full"
            bg="gray.900"
            color="white"
            _hover={{ bg: 'gray.800' }}
            size="md"
          >
            Random Profile
          </Button>
        </Stack>
      </Box>
    </Center>
  )
}

export default RandomProfile
