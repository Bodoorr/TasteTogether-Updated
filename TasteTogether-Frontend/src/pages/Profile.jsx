import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Comment from '../components/Comment'
import {
  Box,
  HStack,
  Text,
  Avatar,
  Stack,
  Button,
  SimpleGrid,
  Image,
  Center,
  Spinner
} from '@chakra-ui/react'
const Profile = ({ setCommentCount }) => {
  const { user_id } = useParams() // get user_id from URL
  const [profileUser, setProfileUser] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // get current logged-in user id from localStorage
  const currentUserId = localStorage.getItem('userId') || null

  useEffect(() => {
    if (!user_id) return // if there's no user_id, return nothing

    // to show the data is loading
    setLoading(true)
    const UserAndPosts = async () => {
      try {
        // axios call to get the user
        const userResponse = await axios.get(
          `http://localhost:3001/users/${user_id}`
        )
        // axios call to get the user posts
        const postsResponse = await axios.get(
          `http://localhost:3001/posts?user=${user_id}`
        )

        setProfileUser(userResponse.data.user) // set the profile user
        setUserPosts(postsResponse.data) // set `the` user posts
      } catch (err) {
        setError('Failed to load profile or posts')
      }
      setLoading(false) // loading finished
    }
    UserAndPosts()
  }, [user_id])

  return (
    <Box px={{ base: 4, md: 8 }} py={6} pl={{ base: '72px', md: '96px' }}>
      {loading && (
        <Center py={16}>
          <Spinner size="lg" thickness="3px" />
        </Center>
      )}

      {!loading && error && (
        <Center py={16}>
          <Text color="red.500">{error}</Text>
        </Center>
      )}

      {!loading && !error && !profileUser && (
        <Center py={16}>
          <Text color="gray.600">No profile found.</Text>
        </Center>
      )}

      {!loading && !error && profileUser && (
        <>
          <Box maxW="980px" mx="auto">
            <HStack align="center" spacing={6}>
              <Avatar.Root
                size="2xl"
                shape="full"
                style={{ borderRadius: '50%', overflow: 'hidden' }}
              >
                <Avatar.Fallback bg="gray.300" style={{ borderRadius: '50%' }}>
                  {profileUser.username?.[0]?.toUpperCase() || 'U'}
                </Avatar.Fallback>

                {profileUser.image && (
                  <Avatar.Image
                    src={`http://localhost:3001/uploads/${profileUser.image}`}
                    style={{ borderRadius: '50%' }}
                  />
                )}
              </Avatar.Root>

              <Box flex="1">
                <HStack
                  justify="space-between"
                  align="center"
                  flexWrap="wrap"
                  gap={3}
                >
                  <Text fontSize="2xl" fontWeight="bold" color="gray.900">
                    {profileUser.username}
                  </Text>

                  {currentUserId === profileUser._id && (
                    <Button
                      as={Link}
                      to={`/edit-profile/${profileUser._id}`}
                      borderRadius="full"
                      variant="outline"
                      size="sm"
                    >
                      Edit Profile
                    </Button>
                  )}
                </HStack>

                <HStack spacing={6} mt={2} color="gray.700" fontSize="sm">
                  <HStack spacing={2}>
                    <Text fontWeight="bold" color="gray.900">
                      {userPosts.length}
                    </Text>
                    <Text>posts</Text>
                  </HStack>
                </HStack>
              </Box>
            </HStack>

            <Box h="1px" bg="gray.200" my={6} />

            <SimpleGrid columns={{ base: 4, md: 5 }} spacing={9}>
              {userPosts.map((post) => (
                <Box
                  key={post._id}
                  position="relative"
                  borderRadius="md"
                  overflow="hidden"
                  cursor="pointer"
                  bg="gray.100"
                  aspectRatio={1}
                  _hover={{ opacity: 0.92 }}
                  transition="0.2s"
                  onClick={() => setSelectedPost(post)}
                >
                  <Image
                    src={`http://localhost:3001/uploads/${post.postImage}`}
                    alt="User post"
                    w="100%"
                    h="100%"
                    objectFit="cover"
                  />
                </Box>
              ))}
            </SimpleGrid>
          </Box>

          {selectedPost && (
            <Box
              position="fixed"
              inset={0}
              bg="blackAlpha.600"
              zIndex={2000}
              display="flex"
              alignItems="center"
              justifyContent="center"
              px={4}
              onClick={() => setSelectedPost(null)}
            >
              <Box
                maxW="980px"
                w="100%"
                bg="white"
                borderRadius="2xl"
                overflow="hidden"
                boxShadow="lg"
                onClick={(e) => e.stopPropagation()}
              >
                <Stack direction={{ base: 'column', md: 'row' }} spacing={0}>
                  <Box bg="transparent" flex="1">
                    <Image
                      src={`http://localhost:3001/uploads/${selectedPost.postImage}`}
                      alt="Post preview"
                      w="100%"
                      h={{ base: '320px', md: '520px' }}
                      objectFit="contain"
                    />
                  </Box>

                  <Box w={{ base: '100%', md: '380px' }} p={4}>
                    <Stack spacing={4}>
                      <HStack justify="space-between" align="center">
                        <HStack spacing={3}>
                          <Avatar.Root
                            size="sm"
                            shape="full"
                            style={{ borderRadius: '50%', overflow: 'hidden' }}
                          >
                            <Avatar.Fallback
                              bg="gray.300"
                              style={{ borderRadius: '50%' }}
                            >
                              {profileUser.username?.[0]?.toUpperCase() || 'U'}
                            </Avatar.Fallback>

                            {profileUser.image && (
                              <Avatar.Image
                                src={`http://localhost:3001/uploads/${profileUser.image}`}
                                style={{ borderRadius: '50%' }}
                              />
                            )}
                          </Avatar.Root>

                          <Text
                            fontWeight="semibold"
                            color="gray.900"
                            fontSize="sm"
                          >
                            {profileUser.username}
                          </Text>
                        </HStack>

                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => setSelectedPost(null)}
                        >
                          Close
                        </Button>
                      </HStack>

                      {selectedPost.postDescription && (
                        <Box
                          p={3}
                          bg="gray.50"
                          borderRadius="lg"
                          maxH="120px"
                          overflowY="auto"
                        >
                          <Text fontSize="sm" color="gray.700" lineHeight="1.6">
                            {selectedPost.postDescription}
                          </Text>
                        </Box>
                      )}

                      <HStack spacing={2} fontSize="sm">
                        <Text fontWeight="bold" color="gray.900">
                          {selectedPost.likes?.length || 0}
                        </Text>
                        <Text color="gray.600">likes</Text>
                      </HStack>

                      <Box
                        borderTop="1px solid"
                        borderColor="gray.200"
                        pt={3}
                        maxH="260px"
                        overflowY="auto"
                      >
                        <Comment
                          postId={selectedPost._id}
                          setCommentCount={setCommentCount}
                        />
                      </Box>

                      {selectedPost.user?._id?.toString() === currentUserId && (
                        <HStack spacing={2} pt={2}>
                          <Button
                            as={Link}
                            to={`/updatePost/${selectedPost._id}`}
                            onClick={() => setSelectedPost(null)}
                            size="sm"
                            variant="outline"
                            borderRadius="full"
                            flex="1"
                            minW="0"
                          >
                            Edit
                          </Button>

                          <Button
                            size="sm"
                            borderRadius="full"
                            bg="red.500"
                            color="white"
                            _hover={{ bg: 'red.600' }}
                            flex="1"
                            minW="0"
                            onClick={async () => {
                              try {
                                const token = localStorage.getItem('token')
                                await axios.delete(
                                  `http://localhost:3001/posts/${selectedPost._id}`,
                                  {
                                    headers: {
                                      Authorization: `Bearer ${token}`
                                    }
                                  }
                                )
                                setUserPosts((prev) =>
                                  prev.filter((p) => p._id !== selectedPost._id)
                                )
                                setSelectedPost(null)
                              } catch (error) {
                                console.error('Error deleting post:', error)
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </HStack>
                      )}
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

export default Profile
