import {
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaHeart,
  FaRegHeart,
  FaComment
} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Comment from './Comment'
import {
  Box,
  HStack,
  Text,
  Image,
  IconButton,
  Menu,
  Spacer,
  Avatar
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const Post = ({ post, user }) => {
  const navigate = useNavigate()
  const currentUserId = localStorage.getItem('userId')
  const token = localStorage.getItem('token')

  const [isDeleted, setIsDeleted] = useState(false)
  const [liked, setLiked] = useState(post.likes.includes(currentUserId))
  const [likeCount, setLikeCount] = useState(post.likes.length)
  const [menuOpen, setMenuOpen] = useState(false)
  const [foodEmojis, setFoodEmojis] = useState([])
  const [showComments, setShowComments] = useState(false)
  const [commentCount, setCommentCount] = useState(0)

  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/comments/${post._id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        setCommentCount(response.data.length)
      } catch (error) {
        console.error('Error fetching comment count:', error)
      }
    }

    fetchCommentCount()
  }, [post._id])

  const goToProfile = () => {
    const postUserId = post.user?._id || post.user?.id
    if (postUserId) navigate(`/profile/${postUserId}`)
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/posts/${post._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setIsDeleted(true)
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3001/posts/${post._id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      const totalLikes = parseInt(response.data, 10)
      setLikeCount(totalLikes)
      setLiked((prev) => !prev)

      if (!liked) {
        const emojis = ['💕', '🍕']
        setFoodEmojis(emojis)
        setTimeout(() => setFoodEmojis([]), 1000)
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }
  if (isDeleted) return null

  return (
    <>
      <Box
        maxW="600px"
        mx="auto"
        mb={6}
        p={4}
        borderRadius="lg"
        boxShadow="md"
        bg="white"
      >
        <HStack mb={3}>
          <Avatar.Root
            onClick={goToProfile}
            size="sm"
            shape="full"
            style={{
              borderRadius: '50%',
              overflow: 'hidden',
              cursor: 'pointer'
            }}
          >
            <Avatar.Fallback bg="gray.300" style={{ borderRadius: '50%' }}>
              {post.user?.username?.[0]?.toUpperCase() || 'U'}
            </Avatar.Fallback>

            {post.user?.image && (
              <Avatar.Image
                src={`http://localhost:3001/uploads/${post.user.image}`}
                style={{ borderRadius: '50%' }}
              />
            )}
          </Avatar.Root>

          <Text fontWeight="semibold" color="black">
            {post.user.username}
          </Text>

          <Spacer />

          {post.user && String(post.user._id) === String(currentUserId) && (
            <Menu.Root
              open={menuOpen}
              onOpenChange={(e) => setMenuOpen(e.open)}
            >
              <Menu.Trigger asChild cursor="pointer">
                <Box
                  as="button"
                  aria-label="menu"
                  p={1}
                  borderRadius="full"
                  _hover={{ bg: 'gray.100' }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <FaEllipsisV color="#1A202C" size={16} />
                </Box>
              </Menu.Trigger>

              <Menu.Positioner>
                <Menu.Content borderRadius="md" boxShadow="lg">
                  <Menu.Item asChild cursor="pointer">
                    <Link to={`/updatePost/${post._id}`}>
                      <HStack>
                        <FaEdit />
                        <Text>Edit</Text>
                      </HStack>
                    </Link>
                  </Menu.Item>

                  <Menu.Item
                    cursor="pointer"
                    color="red.500"
                    onClick={() => {
                      handleDelete()
                      setMenuOpen(false)
                    }}
                  >
                    <HStack>
                      <FaTrash />
                      <Text>Delete</Text>
                    </HStack>
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>
          )}
        </HStack>

        <Box position="relative" mb={3}>
          <Image
            src={`http://localhost:3001/uploads/${post.postImage}`}
            alt="post"
            w="100%"
            borderRadius="md"
            objectFit="cover"
          />

          {foodEmojis.map((emoji, index) => (
            <Box
              key={index}
              position="absolute"
              left={`${30 + index * 20}px`}
              top="10px"
              fontSize="24px"
              pointerEvents="none"
            >
              {emoji}
            </Box>
          ))}
        </Box>
        <HStack spacing={4} mb={3}>
          <HStack spacing={1}>
            <IconButton
              onClick={handleLike}
              aria-label={liked ? 'Unlike' : 'Like'}
              size="md"
              minW="auto"
              p={0}
              bg="transparent"
            >
              {liked ? (
                <FaHeart color="red" size={24} />
              ) : (
                <FaRegHeart color="#1A202C" size={24} />
              )}
            </IconButton>

            <Text fontSize="sm" color="black">
              {likeCount}
            </Text>
          </HStack>

          <HStack spacing={1}>
            <IconButton
              onClick={() => setShowComments((prev) => !prev)}
              aria-label="comments"
              size="md"
              minW="auto"
              p={0}
              bg="transparent"
            >
              <FaComment color="#1A202C" size={24} />
            </IconButton>

            <Text fontSize="sm" color="gray.900">
              {commentCount}
            </Text>
          </HStack>
        </HStack>

        {post.postDescription && (
          <Text mb={3} fontSize="sm" color="gray.700">
            {post.postDescription}
          </Text>
        )}

        {showComments && (
          <Comment
            postId={post._id}
            setCommentCount={setCommentCount}
            user={user}
          />
        )}
      </Box>
    </>
  )
}

export default Post
