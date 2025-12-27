import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Client from '../services/api'
import {
  Box,
  HStack,
  Text,
  Input,
  Stack,
  Button,
  Center
} from '@chakra-ui/react'
const EditProfile = () => {
  // get the user id from URL param
  const { user_id } = useParams()
  const navigate = useNavigate()
  // token for authentication
  const token = localStorage.getItem('token')

  // store the form data in state
  const [formValues, setFormValues] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    typeOfFood: '',
    image: null
  })

  useEffect(() => {
    const User = async () => {
      try {
        // axios call to get the user data using user id
        const response = await Client.get(
          `/users/${user_id}`
        )
        // save the response in "user"
        const user = response.data.user
        // fill the form with the existing user data
        setFormValues({
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          typeOfFood: user.typeOfFood,
          image: null
        })
      } catch (error) {
        throw error
      }
    }
    // call the function to get the user data
    User()
  }, [user_id])

  // to update the changes in form values
  const handleChange = (e) => {
    const { id, type, files, value } = e.target
    if (type === 'file') {
      setFormValues({ ...formValues, [id]: files[0] })
    } else {
      setFormValues({ ...formValues, [id]: value })
    }
  }

  // handle the submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('username', formValues.username)
    formData.append('firstName', formValues.firstName)
    formData.append('lastName', formValues.lastName)
    formData.append('email', formValues.email)
    formData.append('typeOfFood', formValues.typeOfFood)
    // if an image uploaded, add it
    if (formValues.image) {
      formData.append('profileImage', formValues.image)
    }

    try {
      // axios call to update the user profile
      await Client.put(`/users/${user_id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      // after updating, go to the user profile page
      navigate(`/profile/${user_id}`)
    } catch (error) {
      throw error
    }
  }

  return (
    <Center minH="100vh" px={4}>
      <Box
        w="100%"
        maxW="520px"
        p={6}
        borderRadius="2xl"
        boxShadow="md"
        bg="white"
      >
        <Stack spacing={6}>
          <Box textAlign="center">
            <Text fontSize="2xl" fontWeight="bold" color="gray.900">
              Edit Profile
            </Text>
            <Text fontSize="sm" color="gray.600" mt={1}>
              Update your personal information
            </Text>
          </Box>

          <Box as="form" onSubmit={handleSubmit}>
            <Stack spacing={5}>
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color="gray.800"
                  mb={2}
                >
                  First Name
                </Text>
                <Input
                  id="firstName"
                  type="text"
                  value={formValues.firstName}
                  onChange={handleChange}
                  borderRadius="xl"
                  bg="gray.50"
                  borderColor="gray.200"
                  _focus={{
                    borderColor: 'teal.400',
                    boxShadow: '0 0 0 1px teal'
                  }}
                />
              </Box>

              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color="gray.800"
                  mb={2}
                >
                  Last Name
                </Text>
                <Input
                  id="lastName"
                  type="text"
                  value={formValues.lastName}
                  onChange={handleChange}
                  borderRadius="xl"
                  bg="gray.50"
                  borderColor="gray.200"
                  _focus={{
                    borderColor: 'teal.400',
                    boxShadow: '0 0 0 1px teal'
                  }}
                />
              </Box>

              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color="gray.800"
                  mb={2}
                >
                  Email
                </Text>
                <Input
                  id="email"
                  type="email"
                  value={formValues.email}
                  onChange={handleChange}
                  borderRadius="xl"
                  bg="gray.50"
                  borderColor="gray.200"
                  _focus={{
                    borderColor: 'teal.400',
                    boxShadow: '0 0 0 1px teal'
                  }}
                />
              </Box>

              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color="gray.800"
                  mb={2}
                >
                  Favorite Food Type
                </Text>
                <Input
                  id="typeOfFood"
                  type="text"
                  value={formValues.typeOfFood}
                  onChange={handleChange}
                  placeholder="e.g. Italian, Desserts, Healthy"
                  borderRadius="xl"
                  bg="gray.50"
                  borderColor="gray.200"
                  _focus={{
                    borderColor: 'teal.400',
                    boxShadow: '0 0 0 1px teal'
                  }}
                />
              </Box>

              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color="gray.800"
                  mb={2}
                >
                  Profile Image
                </Text>

                <HStack spacing={3}>
                  <Button
                    as="label"
                    htmlFor="image"
                    variant="outline"
                    borderRadius="full"
                    size="sm"
                    cursor="pointer"
                    _hover={{ bg: 'gray.50' }}
                  >
                    Choose Image
                  </Button>

                  <Text fontSize="sm" color="gray.600">
                    {formValues.image?.name || 'No file selected'}
                  </Text>
                </HStack>

                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  display="none"
                />
              </Box>

              <Button
                type="submit"
                borderRadius="full"
                bg="gray.900"
                color="white"
                _hover={{ bg: 'gray.800' }}
                w="full"
                mt={2}
              >
                Update Profile
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Center>
  )
}

export default EditProfile
