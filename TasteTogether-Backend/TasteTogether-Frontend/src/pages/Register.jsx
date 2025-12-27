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
import { useState } from 'react'
import { RegisterUser } from '../services/Auth'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
  const navigate = useNavigate()

  const initialState = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    image: '',
    typeOfFood: ''
  }

  const [errors, setErrors] = useState({})
  const [formValues, setFormValues] = useState(initialState)

  const handleChange = (e) => {
    const { id, type, files, value } = e.target

    if (type === 'file') {
      setFormValues((prev) => ({
        ...prev,
        [id]: files[0]
      }))
    } else {
      setFormValues((prev) => ({
        ...prev,
        [id]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    try {
      const formData = new FormData()
      formData.append('username', formValues.username)
      formData.append('firstName', formValues.firstName)
      formData.append('lastName', formValues.lastName)
      formData.append('email', formValues.email)
      formData.append('password', formValues.password)
      formData.append('confirmPassword', formValues.confirmPassword)
      formData.append('typeOfFood', formValues.typeOfFood)

      if (formValues.image) {
        formData.append('profileImage', formValues.image) // key must match backend
      }

      await RegisterUser(formData)

      setFormValues(initialState)
      navigate('/signin')
    } catch (error) {
      const msg =
        error?.response?.data?.msg ||
        error?.msg ||
        error?.message ||
        'Registration failed. Please try again.'

      if (msg.toLowerCase().includes('username')) {
        setErrors({ username: msg })
      } else if (msg.toLowerCase().includes('password')) {
        setErrors({ password: msg })
      } else {
        setErrors({ general: msg })
      }
    }
  }

  const isSubmitDisabled =
    !formValues.username ||
    !formValues.firstName ||
    !formValues.lastName ||
    !formValues.email ||
    !formValues.password ||
    !formValues.confirmPassword ||
    formValues.password !== formValues.confirmPassword

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
        w="80%"
        maxW="600px"
        bg="white"
        boxShadow="lg"
        borderRadius="lg"
        p={8}
      >
        <VStack align="flex-start" spacing={2} mb={6}>
          <Heading size="lg">Create New Account</Heading>
          <Text fontSize="sm" color="gray.600">
            Already registered?{' '}
            <Text as={Link} to="/signin" color="#1DA3E2" fontWeight="semibold">
              Sign in
            </Text>
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
                First Name <Field.RequiredIndicator />
              </Field.Label>

              <Input
                id="firstName"
                type="text"
                value={formValues.firstName}
                onChange={handleChange}
                placeholder="Your first name"
                variant="filled"
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label>
                Last Name <Field.RequiredIndicator />
              </Field.Label>

              <Input
                id="lastName"
                type="text"
                value={formValues.lastName}
                onChange={handleChange}
                placeholder="Your last name"
                variant="filled"
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label>
                Email <Field.RequiredIndicator />
              </Field.Label>

              <Input
                id="email"
                type="email"
                value={formValues.email}
                onChange={handleChange}
                placeholder="example@example.com"
                variant="filled"
              />
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

            <Field.Root required invalid={!!errors.password}>
              <Field.Label>
                Confirm Password <Field.RequiredIndicator />
              </Field.Label>

              <Input
                id="confirmPassword"
                type="password"
                value={formValues.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                variant="filled"
              />

              <Field.ErrorText>{errors.password}</Field.ErrorText>
            </Field.Root>

            <Field.Root>
              <Field.Label>Profile Image</Field.Label>

              <Input
                id="image"
                type="file"
                onChange={handleChange}
                variant="unstyled"
                pt={1}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Favorite Type of Food</Field.Label>

              <Input
                id="typeOfFood"
                type="text"
                value={formValues.typeOfFood}
                onChange={handleChange}
                placeholder="Italian, Japanese, etc."
                variant="filled"
              />
            </Field.Root>

            <Button
              type="submit"
              colorScheme="teal"
              w="full"
              mt={2}
              isDisabled={isSubmitDisabled}
            >
              Register
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}

export default Register
