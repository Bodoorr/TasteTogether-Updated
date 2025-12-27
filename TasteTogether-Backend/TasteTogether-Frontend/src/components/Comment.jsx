import { useState, useEffect } from 'react'
import Client from '../services/api'
import {
  Box,
  HStack,
  Text,
  Avatar,
  Stack,
  Input,
  Button
} from '@chakra-ui/react'
const Comment = ({ postId, setCommentCount, user }) => {
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await Client.get(
          `/comments/${postId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        setComments(response.data)
        setCommentCount(comments.length)
      } catch (error) {
        console.error('Error fetching comments:', error)
      }
    }
    fetchComments()
  }, [postId
  ])

  const onClickHandler = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await Client.post(
        '/comments',
        {
          comment,
          postId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      const newComment = response.data
      setComments((prevComments) => [...prevComments, newComment])
      setCommentCount((prev) => prev + 1)
      setComment('')
    } catch (error) {
      console.error('Error posting comment:', error)
    }
  }

  const onChangeHandler = (e) => {
    setComment(e.target.value)
  }

  const toggleComments = () => {
    setShowAll(!showAll)
  }

  //source: https://www.w3schools.com/js/js_array_methods.asp#mark_slice
  //slice will slice out a piece of an array into new array
  //if showAll is false it'll show only the last 3 comments from comments array || if showAll is true it'll display the whole comments array
  //and then save the results into visibleComments variable
  const visibleComments = showAll ? comments : comments.slice(-3)

  
  return (
    <Box mt={3}>
      <Stack spacing={3}>
        {visibleComments.map((text) => (
          <Box key={text._id} p={3} borderRadius="md" bg="gray.50">
            <HStack spacing={3} mb={1} align="start">
              <Avatar.Root
                size="xs"
                shape="full"
                style={{ borderRadius: '50%', overflow: 'hidden' }}
              >
                <Avatar.Fallback bg="gray.300" style={{ borderRadius: '50%' }}>
                  {text.user?.username?.[0]?.toUpperCase() || 'U'}
                </Avatar.Fallback>

                {text.user?.image && (
                  <Avatar.Image
                    src={`http://localhost:3001/uploads/${text.user.image}`}
                    style={{ borderRadius: '50%' }}
                  />
                )}
              </Avatar.Root>

              <Box>
                <Text fontWeight="semibold" fontSize="sm" color="gray.900">
                  {text.user?.username}
                </Text>
                <Text fontSize="sm" color="gray.700">
                  {text.comment}
                </Text>
              </Box>
            </HStack>
          </Box>
        ))}

        {comments.length > 3 && (
          <Button
            onClick={toggleComments}
            variant="ghost"
            size="sm"
            alignSelf="flex-start"
            px={0}
            color="gray.700"
            _hover={{ bg: 'transparent', color: 'gray.900' }}
          >
            {showAll ? 'Hide' : 'View all'}
          </Button>
        )}

        <HStack mt={2} spacing={2} align="center">
          <Input
            value={comment}
            onChange={onChangeHandler}
            placeholder="Leave a comment..."
            size="sm"
            borderRadius="full"
            bg="white"
            borderColor="gray.200"
            _focus={{
              borderColor: 'gray.400'
            }}
            color="black"
          />

          <Button
            onClick={onClickHandler}
            size="sm"
            borderRadius="full"
            px={5}
            bg="gray.900"
            color="white"
            _hover={{ bg: 'gray.800' }}
            isDisabled={!comment.trim()}
          >
            Submit
          </Button>
        </HStack>
      </Stack>
    </Box>
  )
}

export default Comment
