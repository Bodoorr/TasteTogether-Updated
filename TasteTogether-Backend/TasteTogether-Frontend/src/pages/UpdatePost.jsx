import { useState, useEffect } from 'react'
import Client from '../services/api'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  HStack,
  Text,
  Input,
  Stack,
  Button,
  Center
} from '@chakra-ui/react'
const UpdatePost = ({ addPost }) => {
  const initialState = {
    postImage: '',
    postDescription: ''
  }
  const [postState, setPostState] = useState(initialState)
  let navigate = useNavigate()
  const { post_id } = useParams()

  useEffect(() => {
    const getPost = async () => {
      
      const response = await Client.get(`/posts/${post_id}`)
      setPostState({
        postImage: '',
        postDescription: response.data.postDescription
      })
    }
    getPost()
  }, [post_id])

  const handleChange = (event) => {
    const { id, value, files } = event.target
    setPostState({
      ...postState,
      [id]: files ? files[0] : value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData()
    if (postState.postImage) {
      formData.append('postImage', postState.postImage)
    }
    formData.append('postDescription', postState.postDescription)

    const token = localStorage.getItem('token')

    const response = await Client.put(
      `/posts/${post_id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      }
    )
    const newPost = response.data
    addPost(newPost)
    console.log(newPost)
    setPostState(initialState)
    navigate('/main')
  }
  return (
    <Center minH="100vh" px={4}>
      <Box
        w="600px"
        mx="auto"
        mt={0}
        p={6}
        borderRadius="2xl"
        boxShadow="md"
        bg="white"
      >
        <Stack spacing={6}>
          <Box>
            <Text fontSize="2xl" fontWeight="bold" color="gray.900">
              Update Post
            </Text>
            <Text fontSize="sm" color="gray.600" mt={1}>
              Replace the image or update your description.
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
                  Post Image
                </Text>

                <HStack spacing={3}>
                  <Button
                    as="label"
                    htmlFor="postImage"
                    variant="outline"
                    borderRadius="full"
                    cursor="pointer"
                    _hover={{ bg: 'gray.50' }}
                  >
                    Choose Image
                  </Button>

                  <Text fontSize="sm" color="gray.600">
                    {postState.postImage?.name || 'No file selected'}
                  </Text>
                </HStack>

                <Input
                  id="postImage"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  display="none"
                />
              </Box>

              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color="gray.800"
                  mb={2}
                >
                  Post Description
                </Text>

                <Input
                  id="postDescription"
                  type="text"
                  placeholder="Write something about your post..."
                  onChange={handleChange}
                  value={postState.postDescription}
                  borderRadius="xl"
                  bg="gray.50"
                  borderColor="gray.200"
                  _focus={{
                    borderColor: 'teal.400',
                    boxShadow: '0 0 0 1px teal'
                  }}
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
                Update Post
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Center>
  )
}

export default UpdatePost
