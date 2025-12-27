import { useState } from 'react'
import { SignInUser } from '../services/Auth'
import { useNavigate } from 'react-router-dom'
import {
  Input,
  Stack,
  Field,
  Box,
  Button,
  Heading,
  Text,
  VStack
} from '@chakra-ui/react'

const SignIn = ({ setUser }) => {
  let navigate = useNavigate()
  const initialState = { username: '', password: '' }
  const [formValues, setFormValues] = useState(initialState)
  const [errors, setErrors] = useState({})
  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = await SignInUser(formValues)
      setFormValues(initialState)
      setUser(payload.user || payload)
      const userId = payload?.user?._id || payload?.id
      if (userId) {
        localStorage.setItem('userId', userId)
      }
      if (payload?.token) {
        localStorage.setItem('token', payload.token)
      }
      navigate('/main')
    } catch (error) {
      setErrors({
        general: error?.msg || 'Login failed. Please try again.'
      })
    }
  }

  return (
    <Box
      minH="100vh"
      bg="gray.50"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
    >
      <Box
        w="100%"
        maxW="600px"
        bg="white"
        boxShadow="lg"
        borderRadius="lg"
        p={8}
      >
        <VStack align="flex-start" spacing={2} mb={6}>
          <Heading size="lg">Sign In</Heading>
          <Text fontSize="sm" color="gray.600">
            Sign in to continue{' '}
          </Text>
          {errors.general && (
            <Text fontSize="sm" color="red.500">
              {errors.general}
            </Text>
          )}
        </VStack>

        <Box as="form" onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <Field.Root required invalid={!!errors.username}>
              <Field.Label>
                Username <Field.RequiredIndicator />
              </Field.Label>

              <Input
                id="username"
                type="text"
                value={formValues.username}
                onChange={handleChange}
                placeholder="username"
                variant="filled"
              />
              <Field.ErrorText>{errors.username}</Field.ErrorText>
            </Field.Root>

            <Field.Root required>
              <Field.Label>
                Password <Field.RequiredIndicator />
              </Field.Label>

              <Input
                id="password"
                type="password"
                value={formValues.password}
                onChange={handleChange}
                placeholder="Enter password"
                variant="filled"
              />
            </Field.Root>

            <Button
              type="submit"
              colorScheme="teal"
              w="full"
              mt={2}
              disabled={!formValues.username || !formValues.password}
            >
              Sign In
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}

export default SignIn
