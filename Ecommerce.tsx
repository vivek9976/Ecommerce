'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import Head from 'next/head';

type ClothingItem = {
  id: string;
  image: string;
  title: string;
  description: string;
  content: string;
  price: number;
  size: string;
  hashtags: string[];
  likes: number;
  liked: boolean;
  user: {
    name: string;
    avatar: string;
    email: string;
    bio: string;
    location: string;
  };
  comments: Comment[];
};

type Comment = {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
};

type Message = {
  id: string;
  sender: string;
  senderEmail: string;
  receiver: string;
  text: string;
  timestamp: string;
};

export default function ClothingMarketplace() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeTab, setActiveTab] = useState<
    'marketplace' | 'post' | 'messages' | 'profile'
  >('marketplace');
  const [selectedClothing, setSelectedClothing] = useState<ClothingItem | null>(
    null
  );
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    content: '',
    price: '',
    size: 'M',
    hashtags: '',
    image: '',
    imageFile: null as File | null,
    imagePreview: '',
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const controls = useAnimation();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Fix for window undefined error
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sample initial data
  useEffect(() => {
    setClothingItems([
      {
        id: '1',
        image:
          'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=500&auto=format&fit=crop&q=60',
        title: 'Denim Jacket',
        description: 'Vintage blue denim jacket with distressed details',
        content:
          'This vintage denim jacket features a classic fit with distressed detailing for a worn-in look. Made from 100% cotton denim with a medium wash. Perfect for layering over t-shirts or sweaters. Machine wash cold, tumble dry low.',
        price: 59.99,
        size: 'M',
        hashtags: ['jacket', 'denim', 'vintage'],
        likes: 24,
        liked: false,
        user: {
          name: 'Alex Morgan',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          email: 'alex@example.com',
          bio: 'Fashion designer specializing in vintage clothing. Love sustainable fashion!',
          location: 'Los Angeles, CA',
        },
        comments: [
          {
            id: 'c1',
            user: {
              name: 'Taylor Swift',
              avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            },
            text: 'Love this jacket! What are the measurements?',
            timestamp: '2023-05-15T10:30:00',
          },
        ],
      },
      {
        id: '2',
        image:
          'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=500&auto=format&fit=crop&q=60',
        title: 'White Sneakers',
        description: 'Classic white leather sneakers with rubber sole',
        content:
          'These premium white leather sneakers feature a cushioned insole for all-day comfort and a durable rubber outsole. The minimalist design pairs well with any outfit. True to size - we recommend ordering your normal shoe size. Spot clean only.',
        price: 89.99,
        size: '9',
        hashtags: ['shoes', 'sneakers', 'white'],
        likes: 18,
        liked: false,
        user: {
          name: 'Jamie Lee',
          avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
          email: 'jamie@example.com',
          bio: 'Sneaker collector and fashion enthusiast. Always looking for the next great pair!',
          location: 'New York, NY',
        },
        comments: [],
      },
      {
        id: '3',
        image:
          'https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?w=500&auto=format&fit=crop&q=60',
        title: 'Graphic T-Shirt',
        description: 'Black cotton t-shirt with vintage band print',
        content:
          'Soft 100% cotton t-shirt with a vintage-inspired band graphic print. Relaxed fit with a crew neck. Machine wash cold, tumble dry low. Imported.',
        price: 24.99,
        size: 'L',
        hashtags: ['tshirt', 'graphic', 'band'],
        likes: 12,
        liked: false,
        user: {
          name: 'Current User',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          email: 'user@example.com',
          bio: 'Fashion enthusiast and thrift store hunter. Love finding unique pieces with history!',
          location: 'Chicago, IL',
        },
        comments: [],
      },
    ]);

    setMessages([
      {
        id: 'm1',
        sender: 'Alex Morgan',
        senderEmail: 'alex@example.com',
        receiver: 'You',
        text: 'Hi, I saw you liked my denim jacket. Are you interested in purchasing?',
        timestamp: '2023-05-16T14:30:00',
      },
      {
        id: 'm2',
        sender: 'You',
        senderEmail: 'user@example.com',
        receiver: 'Alex Morgan',
        text: 'Yes, I love it! Would you consider $50?',
        timestamp: '2023-05-16T14:35:00',
      },
      {
        id: 'm3',
        sender: 'Alex Morgan',
        senderEmail: 'alex@example.com',
        receiver: 'You',
        text: 'I could do $55 if that works for you?',
        timestamp: '2023-05-16T14:40:00',
      },
      {
        id: 'm4',
        sender: 'You',
        senderEmail: 'user@example.com',
        receiver: 'Alex Morgan',
        text: 'Deal! How should we arrange payment and delivery?',
        timestamp: '2023-05-16T14:42:00',
      },
      {
        id: 'm5',
        sender: 'Alex Morgan',
        senderEmail: 'alex@example.com',
        receiver: 'You',
        text: 'I accept PayPal and can ship via USPS Priority Mail. I can send you an invoice if you provide your PayPal email.',
        timestamp: '2023-05-16T14:45:00',
      },
    ]);

    // Check for saved theme preference
    const savedTheme =
      (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    setTheme(savedTheme);
    document.body.className = savedTheme;
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedClothing]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.className = newTheme;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    controls
      .start({
        opacity: 0,
        transition: { duration: 0.5 },
      })
      .then(() => {
        alert(
          'You have been logged out. In a real app, this would redirect to login page.'
        );
      });
  };

  const handleLike = (id: string) => {
    setClothingItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              likes: item.liked ? item.likes - 1 : item.likes + 1,
              liked: !item.liked,
            }
          : item
      )
    );

    if (selectedClothing?.id === id) {
      setSelectedClothing((prev) =>
        prev
          ? {
              ...prev,
              likes: prev.liked ? prev.likes - 1 : prev.likes + 1,
              liked: !prev.liked,
            }
          : null
      );
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // In a real app, you would upload the image to a server
    let imageUrl = newPost.image;
    if (newPost.imageFile) {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      imageUrl = URL.createObjectURL(newPost.imageFile);
    }

    const newItem: ClothingItem = {
      id: Date.now().toString(),
      image:
        imageUrl ||
        'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500&auto=format&fit=crop&q=60',
      title: newPost.title,
      description: newPost.description,
      content: newPost.content,
      price: parseFloat(newPost.price),
      size: newPost.size,
      hashtags: newPost.hashtags.split(',').map((tag) => tag.trim()),
      likes: 0,
      liked: false,
      user: {
        name: 'Current User',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        email: 'user@example.com',
        bio: 'Fashion enthusiast and thrift store hunter. Love finding unique pieces with history!',
        location: 'Chicago, IL',
      },
      comments: [],
    };

    setClothingItems([newItem, ...clothingItems]);
    setNewPost({
      title: '',
      description: '',
      content: '',
      price: '',
      size: 'M',
      hashtags: '',
      image: '',
      imageFile: null,
      imagePreview: '',
    });
    setActiveTab('marketplace');
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedClothing) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'You',
      senderEmail: 'user@example.com',
      receiver: selectedClothing.user.name,
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedClothing) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: {
        name: 'Current User',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      },
      text: newComment,
      timestamp: new Date().toISOString(),
    };

    setSelectedClothing({
      ...selectedClothing,
      comments: [...selectedClothing.comments, comment],
    });

    setClothingItems((prevItems) =>
      prevItems.map((item) =>
        item.id === selectedClothing.id
          ? {
              ...item,
              comments: [...item.comments, comment],
            }
          : item
      )
    );

    setNewComment('');
  };

  const handleDeletePost = (id: string) => {
    setClothingItems((prevItems) => prevItems.filter((item) => item.id !== id));
    if (selectedClothing?.id === id) {
      setSelectedClothing(null);
    }
  };

  const handleContactSeller = (clothing: ClothingItem) => {
    setSelectedClothing(clothing);
    setActiveTab('messages');

    // Check if conversation already exists
    const existingConversation = messages.some(
      (m) =>
        m.sender === clothing.user.name || m.receiver === clothing.user.name
    );

    if (!existingConversation) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'You',
        senderEmail: 'user@example.com',
        receiver: clothing.user.name,
        text: `Hi ${clothing.user.name.split(' ')[0]}, I'm interested in your ${
          clothing.title
        }`,
        timestamp: new Date().toISOString(),
      };
      setMessages([...messages, newMessage]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewPost({
        ...newPost,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const copyShareLink = () => {
    const link = `${window.location.origin}/clothing/${selectedClothing?.id}`;
    navigator.clipboard.writeText(link);
    setShareLink(link);
    setShowShareModal(true);
  };

  const filteredItems = clothingItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.hashtags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const currentUserItems = clothingItems.filter(
    (item) => item.user.email === 'user@example.com'
  );

  if (!isLoggedIn) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={controls}
        className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900"
      >
        <div className="p-8 max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in</h1>
          <p className="mb-6">You have been logged out successfully.</p>
          <button
            onClick={() => setIsLoggedIn(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Log In
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}
    >
      {/* Background Animation - Floating clothing items */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * windowSize.width,
              y: Math.random() * windowSize.height,
              rotate: Math.random() * 360,
              opacity: 0.1,
            }}
            animate={{
              x: [null, Math.random() * windowSize.width],
              y: [null, Math.random() * windowSize.height],
              rotate: [null, Math.random() * 360],
            }}
            transition={{
              duration: 30 + Math.random() * 30,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'linear',
            }}
            className="absolute text-4xl"
            style={{
              opacity: 0.1,
            }}
          >
            {['👕', '👖', '👗', '🧥', '👔', '👚', '👞', '🧦'][i]}
          </motion.div>
        ))}
      </div>

      <Head>
        <title>ThreadVault Clothing Marketplace</title>
        <meta
          name="description"
          content="Buy and sell pre-loved clothing items"
        />
      </Head>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className={`relative p-6 rounded-xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } shadow-xl max-w-md w-full`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Share this item</h3>
              <div className="flex items-center mb-4">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className={`flex-1 px-4 py-2 rounded-l-lg ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100 text-gray-900'
                  } focus:outline-none`}
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareLink);
                    alert('Link copied to clipboard!');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                >
                  Copy
                </button>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-h-screen">
        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setShowMobileMenu(false)}
            >
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`h-full w-64 bg-white dark:bg-gray-800 shadow-lg`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b dark:border-gray-700">
                  <h1 className="text-2xl font-bold">
                    <span className="text-blue-600">Thread</span>Vault
                  </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                  <button
                    onClick={() => {
                      setActiveTab('marketplace');
                      setShowMobileMenu(false);
                    }}
                    className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'marketplace'
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="mr-3">🛍️</span>
                    <span className="font-medium">Marketplace</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('post');
                      setShowMobileMenu(false);
                    }}
                    className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'post'
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="mr-3">➕</span>
                    <span className="font-medium">Post Item</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('messages');
                      setShowMobileMenu(false);
                    }}
                    className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'messages'
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="mr-3">💬</span>
                    <span className="font-medium">Messages</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setShowMobileMenu(false);
                    }}
                    className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'profile'
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="mr-3">👤</span>
                    <span className="font-medium">My Profile</span>
                  </button>
                </nav>

                <div className="p-4 border-t dark:border-gray-700">
                  <button
                    onClick={toggleTheme}
                    className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-yellow-300'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    <span className="mr-3">
                      {theme === 'dark' ? '☀️' : '🌙'}
                    </span>
                    <span className="font-medium">
                      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 mt-2"
                  >
                    <span className="mr-3">🚪</span>
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar Navigation */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className={`hidden md:flex flex-col w-64 border-r ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="p-4 border-b dark:border-gray-700">
            <motion.h1
              className="text-2xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-blue-600">Thread</span>Vault
            </motion.h1>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === 'marketplace'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-3">🛍️</span>
              <span className="font-medium">Marketplace</span>
            </button>

            <button
              onClick={() => setActiveTab('post')}
              className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === 'post'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-3">➕</span>
              <span className="font-medium">Post Item</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === 'messages'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-3">💬</span>
              <span className="font-medium">Messages</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === 'profile'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-3">👤</span>
              <span className="font-medium">My Profile</span>
            </button>
          </nav>

          <div className="p-4 border-t dark:border-gray-700">
            <button
              onClick={toggleTheme}
              className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 text-yellow-300'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              <span className="mr-3">{theme === 'dark' ? '☀️' : '🌙'}</span>
              <span className="font-medium">
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 mt-2"
            >
              <span className="mr-3">🚪</span>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </motion.div>

        <div className="flex-1 flex flex-col">
          <header
            className={`sticky top-0 z-10 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-md`}
          >
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <div className="md:hidden">
                <button
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setShowMobileMenu(true)}
                >
                  <span className="text-xl">☰</span>
                </button>
              </div>

              <div className="flex-1 md:flex-none md:w-auto mx-4">
                <div className="relative w-full max-w-md">
                  <input
                    type="text"
                    placeholder="Search clothing..."
                    className={`w-full px-4 py-2 rounded-full ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-100 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      className="absolute right-3 top-2.5 text-gray-500"
                      onClick={() => setSearchQuery('')}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={toggleTheme}
                  className={`p-2 rounded-full ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-yellow-300'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  aria-label="Toggle dark mode"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {theme === 'dark' ? '☀️' : '🌙'}
                </motion.button>

                <motion.button
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src="https://randomuser.me/api/portraits/men/1.jpg"
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="hidden md:inline font-medium">
                    My Profile
                  </span>
                </motion.button>
              </div>
            </div>

            <nav className="border-b border-gray-200 dark:border-gray-700 md:hidden">
              <div className="container mx-auto px-4 flex overflow-x-auto">
                <button
                  className={`px-4 py-3 font-medium whitespace-nowrap ${
                    activeTab === 'marketplace'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                  onClick={() => setActiveTab('marketplace')}
                >
                  Marketplace
                </button>
                <button
                  className={`px-4 py-3 font-medium whitespace-nowrap ${
                    activeTab === 'post'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                  onClick={() => setActiveTab('post')}
                >
                  Post Item
                </button>
                <button
                  className={`px-4 py-3 font-medium whitespace-nowrap ${
                    activeTab === 'messages'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                  onClick={() => setActiveTab('messages')}
                >
                  Messages
                </button>
              </div>
            </nav>
          </header>

          <main className="container mx-auto px-4 py-8 flex-1 relative z-10">
            <AnimatePresence mode="wait">
              {activeTab === 'marketplace' && (
                <motion.div
                  key="marketplace"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {selectedClothing ? (
                    <div className="flex flex-col lg:flex-row gap-8">
                      <div className="lg:w-2/3">
                        <motion.button
                          onClick={() => setSelectedClothing(null)}
                          className="mb-4 flex items-center text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 transition-colors"
                          whileHover={{ x: -5 }}
                        >
                          ← Back to marketplace
                        </motion.button>

                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className={`rounded-xl overflow-hidden shadow-lg ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                          }`}
                        >
                          <img
                            src={selectedClothing.image}
                            alt={selectedClothing.title}
                            className="w-full h-96 object-cover"
                          />

                          <div className="p-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <h2 className="text-2xl font-bold mb-2">
                                  {selectedClothing.title}
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 mb-4">
                                  {selectedClothing.description}
                                </p>
                              </div>

                              <div className="flex items-center space-x-4">
                                <motion.button
                                  onClick={() =>
                                    handleLike(selectedClothing.id)
                                  }
                                  className="flex flex-col items-center"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  <motion.div
                                    animate={{
                                      scale: selectedClothing.liked
                                        ? [1, 1.2, 1]
                                        : 1,
                                      color: selectedClothing.liked
                                        ? '#ef4444'
                                        : theme === 'dark'
                                        ? '#ffffff'
                                        : '#000000',
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="text-2xl"
                                  >
                                    {selectedClothing.liked ? '❤️' : '🤍'}
                                  </motion.div>
                                  <span>{selectedClothing.likes} likes</span>
                                </motion.button>

                                <motion.button
                                  onClick={copyShareLink}
                                  className="flex flex-col items-center text-gray-500 dark:text-gray-400"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  <div className="text-2xl">🔗</div>
                                  <span>Share</span>
                                </motion.button>
                              </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                              {selectedClothing.hashtags.map((tag) => (
                                <motion.span
                                  key={tag}
                                  whileHover={{ y: -2 }}
                                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                                >
                                  #{tag}
                                </motion.span>
                              ))}
                            </div>

                            <div className="mt-6">
                              <h3 className="text-lg font-semibold mb-2">
                                Product Details
                              </h3>
                              <p
                                className={`mb-6 ${
                                  theme === 'dark'
                                    ? 'text-gray-200'
                                    : 'text-gray-700'
                                }`}
                              >
                                {selectedClothing.content}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                              <div>
                                <h3 className="text-lg font-semibold">Price</h3>
                                <motion.p
                                  className="text-2xl font-bold text-blue-600"
                                  animate={{
                                    scale: [1, 1.05, 1],
                                    transition: { duration: 0.5 },
                                  }}
                                >
                                  ${selectedClothing.price.toFixed(2)}
                                </motion.p>
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold">Size</h3>
                                <p className="text-xl">
                                  {selectedClothing.size}
                                </p>
                              </div>
                            </div>

                            <div className="mt-8">
                              <h3 className="text-lg font-semibold mb-4">
                                Comments
                              </h3>
                              <div className="space-y-4">
                                {selectedClothing.comments.map((comment) => (
                                  <motion.div
                                    key={comment.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 rounded-lg ${
                                      theme === 'dark'
                                        ? 'bg-gray-700'
                                        : 'bg-gray-100'
                                    }`}
                                  >
                                    <div className="flex items-center space-x-3 mb-2">
                                      <img
                                        src={comment.user.avatar}
                                        alt={comment.user.name}
                                        className="w-10 h-10 rounded-full"
                                      />
                                      <div>
                                        <h4 className="font-semibold">
                                          {comment.user.name}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                          {new Date(
                                            comment.timestamp
                                          ).toLocaleString()}
                                        </p>
                                      </div>
                                    </div>
                                    <p>{comment.text}</p>
                                  </motion.div>
                                ))}
                              </div>

                              <div className="mt-6">
                                <div className="flex space-x-2">
                                  <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    className={`flex-1 px-4 py-2 rounded-full ${
                                      theme === 'dark'
                                        ? 'bg-gray-700 text-white'
                                        : 'bg-gray-100 text-gray-900'
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    value={newComment}
                                    onChange={(e) =>
                                      setNewComment(e.target.value)
                                    }
                                    onKeyPress={(e) =>
                                      e.key === 'Enter' && handleAddComment()
                                    }
                                  />
                                  <motion.button
                                    onClick={handleAddComment}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    Post
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      <div className="lg:w-1/3">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className={`sticky top-24 p-6 rounded-xl shadow-lg ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                          }`}
                        >
                          <h3 className="text-xl font-bold mb-4">
                            Seller Information
                          </h3>
                          <div className="flex items-center space-x-4 mb-6">
                            <motion.img
                              src={selectedClothing.user.avatar}
                              alt={selectedClothing.user.name}
                              className="w-16 h-16 rounded-full"
                              whileHover={{ scale: 1.1 }}
                            />
                            <div>
                              <h4 className="font-semibold">
                                {selectedClothing.user.name}
                              </h4>
                              <p className="text-gray-500 dark:text-gray-400">
                                {selectedClothing.user.bio}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                📍 {selectedClothing.user.location}
                              </p>
                            </div>
                          </div>

                          <motion.button
                            onClick={() =>
                              handleContactSeller(selectedClothing)
                            }
                            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-4"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Contact Seller
                          </motion.button>

                          {selectedClothing.user.name === 'Current User' && (
                            <motion.button
                              onClick={() =>
                                handleDeletePost(selectedClothing.id)
                              }
                              className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              Delete Post
                            </motion.button>
                          )}
                        </motion.div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <motion.h2
                        className="text-2xl font-bold mb-6"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        Featured Clothing
                      </motion.h2>

                      <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ staggerChildren: 0.1 }}
                      >
                        {filteredItems.map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -5 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            className={`rounded-xl overflow-hidden shadow-lg ${
                              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                            }`}
                            onClick={() => setSelectedClothing(item)}
                          >
                            <div className="relative">
                              <motion.img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-64 object-cover"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                              />
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLike(item.id);
                                }}
                                className="absolute top-3 right-3 p-2 bg-white bg-opacity-80 rounded-full"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <motion.div
                                  animate={{
                                    color: item.liked
                                      ? '#ef4444'
                                      : theme === 'dark'
                                      ? '#ffffff'
                                      : '#000000',
                                    scale: item.liked ? [1, 1.3, 1] : 1,
                                  }}
                                  transition={{ duration: 0.3 }}
                                  className="text-xl"
                                >
                                  {item.liked ? '❤️' : '🤍'}
                                </motion.div>
                              </motion.button>
                              <div className="absolute bottom-3 right-3 px-2 py-1 bg-white bg-opacity-80 rounded-full text-sm">
                                {item.likes} likes
                              </div>
                            </div>

                            <div className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-bold text-lg mb-1">
                                    {item.title}
                                  </h3>
                                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                                    {item.description}
                                  </p>
                                </div>
                                <motion.span
                                  className="font-bold text-blue-600"
                                  whileHover={{ scale: 1.1 }}
                                >
                                  ${item.price.toFixed(2)}
                                </motion.span>
                              </div>

                              <div className="mt-3 flex flex-wrap gap-1">
                                {item.hashtags.slice(0, 3).map((tag) => (
                                  <motion.span
                                    key={tag}
                                    whileHover={{ y: -2 }}
                                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs"
                                  >
                                    #{tag}
                                  </motion.span>
                                ))}
                              </div>

                              <div className="mt-4 flex items-center">
                                <motion.img
                                  src={item.user.avatar}
                                  alt={item.user.name}
                                  className="w-8 h-8 rounded-full mr-2"
                                  whileHover={{ scale: 1.1 }}
                                />
                                <span className="text-sm">
                                  {item.user.name}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'post' && (
                <motion.div
                  key="post"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`max-w-2xl mx-auto p-6 rounded-xl shadow-lg ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  <h2 className="text-2xl font-bold mb-6">
                    Post Your Clothing
                  </h2>

                  <form onSubmit={handlePostSubmit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        className={`w-full px-4 py-2 rounded-lg ${
                          theme === 'dark'
                            ? 'bg-gray-700 text-white'
                            : 'bg-gray-100 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        value={newPost.title}
                        onChange={(e) =>
                          setNewPost({ ...newPost, title: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        Description (Shown on marketplace)
                      </label>
                      <textarea
                        className={`w-full px-4 py-2 rounded-lg ${
                          theme === 'dark'
                            ? 'bg-gray-700 text-white'
                            : 'bg-gray-100 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        rows={3}
                        value={newPost.description}
                        onChange={(e) =>
                          setNewPost({
                            ...newPost,
                            description: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        Content (Shown on product page)
                      </label>
                      <textarea
                        className={`w-full px-4 py-2 rounded-lg ${
                          theme === 'dark'
                            ? 'bg-gray-700 text-white'
                            : 'bg-gray-100 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        rows={5}
                        value={newPost.content}
                        onChange={(e) =>
                          setNewPost({ ...newPost, content: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Price ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          className={`w-full px-4 py-2 rounded-lg ${
                            theme === 'dark'
                              ? 'bg-gray-700 text-white'
                              : 'bg-gray-100 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          value={newPost.price}
                          onChange={(e) =>
                            setNewPost({ ...newPost, price: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Size
                        </label>
                        <select
                          className={`w-full px-4 py-2 rounded-lg ${
                            theme === 'dark'
                              ? 'bg-gray-700 text-white'
                              : 'bg-gray-100 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          value={newPost.size}
                          onChange={(e) =>
                            setNewPost({ ...newPost, size: e.target.value })
                          }
                        >
                          <option value="XS">XS</option>
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                          <option value="XXL">XXL</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        Hashtags (comma separated)
                      </label>
                      <input
                        type="text"
                        className={`w-full px-4 py-2 rounded-lg ${
                          theme === 'dark'
                            ? 'bg-gray-700 text-white'
                            : 'bg-gray-100 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        value={newPost.hashtags}
                        onChange={(e) =>
                          setNewPost({ ...newPost, hashtags: e.target.value })
                        }
                        placeholder="e.g., vintage, denim, casual"
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-1">
                        Image
                      </label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <div className="flex items-center space-x-4">
                        <motion.button
                          type="button"
                          onClick={triggerFileInput}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Upload Image
                        </motion.button>
                        {newPost.imagePreview && (
                          <motion.img
                            src={newPost.imagePreview}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          />
                        )}
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Post Clothing Item
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {activeTab === 'messages' && (
                <motion.div
                  key="messages"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-xl shadow-lg overflow-hidden ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  <div className="flex flex-col md:flex-row h-[calc(100vh-120px)] md:h-[600px]">
                    <div
                      className={`md:w-1/3 border-r ${
                        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                      } ${
                        selectedClothing && window.innerWidth <= 768
                          ? 'hidden'
                          : ''
                      }`}
                    >
                      <div className="p-4 border-b dark:border-gray-700">
                        <h2 className="text-xl font-bold">Messages</h2>
                      </div>

                      <div className="overflow-y-auto h-[calc(100vh-180px)] md:h-[550px]">
                        {clothingItems.map((item) => (
                          <motion.div
                            key={item.id}
                            whileHover={{ scale: 1.01 }}
                            className={`p-4 border-b ${
                              theme === 'dark'
                                ? 'border-gray-700 hover:bg-gray-700'
                                : 'border-gray-200 hover:bg-gray-50'
                            } cursor-pointer`}
                            onClick={() => {
                              setSelectedClothing(item);
                            }}
                          >
                            <div className="flex items-center space-x-3">
                              <img
                                src={item.user.avatar}
                                alt={item.user.name}
                                className="w-12 h-12 rounded-full"
                              />
                              <div>
                                <h3 className="font-semibold">
                                  {item.user.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                  {messages.find(
                                    (m) =>
                                      m.sender === item.user.name ||
                                      m.receiver === item.user.name
                                  )?.text || 'No messages yet'}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="md:w-2/3 flex flex-col min-h-0">
                      {selectedClothing ? (
                        <>
                          <div
                            className={`p-4 border-b dark:border-gray-700 flex items-center sticky top-0 z-20 ${
                              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                            }`}
                          >
                            <motion.button
                              className="md:hidden mr-3"
                              onClick={() => {
                                setSelectedClothing(null);
                              }}
                              whileHover={{ scale: 1.1 }}
                            >
                              ←
                            </motion.button>
                            <img
                              src={selectedClothing.user.avatar}
                              alt={selectedClothing.user.name}
                              className="w-10 h-10 rounded-full mr-3"
                            />
                            <div>
                              <h3 className="font-semibold">
                                {selectedClothing.user.name}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                About: {selectedClothing.user.bio}
                              </p>
                            </div>
                          </div>

                          <div
                            ref={messagesContainerRef}
                            className="flex-1 overflow-y-auto p-4 pt-6 space-y-4 max-h-[calc(100vh-200px)] md:max-h-[calc(600px-80px)] min-h-[200px]"
                          >
                            {messages
                              .filter(
                                (m) =>
                                  (m.sender === selectedClothing.user.name &&
                                    m.receiver === 'You') ||
                                  (m.sender === 'You' &&
                                    m.receiver === selectedClothing.user.name)
                              )
                              .map((message) => (
                                <motion.div
                                  key={message.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className={`flex ${
                                    message.sender === 'You'
                                      ? 'justify-end'
                                      : 'justify-start'
                                  }`}
                                >
                                  <motion.div
                                    className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                                      message.sender === 'You'
                                        ? 'bg-blue-600 text-white'
                                        : theme === 'dark'
                                        ? 'bg-gray-700'
                                        : 'bg-gray-100'
                                    }`}
                                    whileHover={{ scale: 1.02 }}
                                  >
                                    {message.sender !== 'You' && (
                                      <p className="font-semibold text-sm mb-1">
                                        {message.sender}
                                      </p>
                                    )}
                                    <p>{message.text}</p>
                                    <p
                                      className={`text-xs mt-1 ${
                                        message.sender === 'You'
                                          ? 'text-blue-200'
                                          : 'text-gray-500'
                                      }`}
                                    >
                                      {new Date(
                                        message.timestamp
                                      ).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </p>
                                  </motion.div>
                                </motion.div>
                              ))}
                            <div ref={messageEndRef} />
                          </div>

                          {/* Message input */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 border-t dark:border-gray-700"
                          >
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                placeholder="Type a message..."
                                className={`flex-1 px-4 py-2 rounded-full ${
                                  theme === 'dark'
                                    ? 'bg-gray-700 text-white'
                                    : 'bg-gray-100 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) =>
                                  e.key === 'Enter' && handleSendMessage()
                                }
                              />
                              <motion.button
                                onClick={handleSendMessage}
                                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Send
                              </motion.button>
                            </div>
                          </motion.div>
                        </>
                      ) : (
                        <motion.div
                          className="flex-1 flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <div className="text-center p-6">
                            <div className="text-5xl mb-4">💬</div>
                            <h3 className="text-xl font-bold mb-2">
                              No conversation selected
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                              Select a conversation from the list to start
                              messaging
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`max-w-4xl mx-auto rounded-xl shadow-lg overflow-hidden ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  <div className="relative">
                    {/* Profile cover image */}
                    <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600"></div>

                    {/* Profile picture and basic info */}
                    <div className="px-6 pb-6 pt-4">
                      <div className="flex flex-col md:flex-row items-start md:items-end -mt-16">
                        <motion.img
                          src="https://randomuser.me/api/portraits/men/1.jpg"
                          alt="Profile"
                          className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800"
                          whileHover={{ scale: 1.05 }}
                        />
                        <div className="md:ml-6 mt-4 md:mt-0 max-w-full overflow-hidden">
                          <h1 className="text-2xl font-bold truncate">
                            Current User
                          </h1>
                          <p className="text-gray-500 dark:text-gray-400">
                            Fashion Enthusiast
                          </p>
                          <div className="flex items-center mt-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              📍 Chicago, IL
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Profile details */}
                    <div className="px-6 py-4 border-t dark:border-gray-700">
                      <h2 className="text-xl font-bold mb-4">About Me</h2>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        Fashion enthusiast and thrift store hunter. Love finding
                        unique pieces with history! I've been collecting vintage
                        clothing for over 5 years and love sharing my finds with
                        others.
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div
                          className={`p-4 rounded-lg ${
                            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                          }`}
                        >
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Items Listed
                          </p>
                          <p className="text-xl font-bold">
                            {currentUserItems.length}
                          </p>
                        </div>
                        <div
                          className={`p-4 rounded-lg ${
                            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                          }`}
                        >
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Total Likes
                          </p>
                          <p className="text-xl font-bold">
                            {currentUserItems.reduce(
                              (sum, item) => sum + item.likes,
                              0
                            )}
                          </p>
                        </div>
                        <div
                          className={`p-4 rounded-lg ${
                            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                          }`}
                        >
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Member Since
                          </p>
                          <p className="text-xl font-bold">2022</p>
                        </div>
                        <div
                          className={`p-4 rounded-lg ${
                            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                          }`}
                        >
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Rating
                          </p>
                          <p className="text-xl font-bold">4.8 ★</p>
                        </div>
                      </div>

                      <h2 className="text-xl font-bold mb-4">
                        Contact Information
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Email
                          </p>
                          <p className="font-medium">user@example.com</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Phone
                          </p>
                          <p className="font-medium">(123) 456-7890</p>
                        </div>
                      </div>
                    </div>

                    {/* User's listings */}
                    <div className="border-t dark:border-gray-700 p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">My Listings</h2>
                        <motion.button
                          onClick={() => setActiveTab('post')}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          whileHover={{ scale: 1.05 }}
                        >
                          + Add New Item
                        </motion.button>
                      </div>

                      {currentUserItems.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {currentUserItems.map((item) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              whileHover={{ y: -5 }}
                              className={`rounded-xl overflow-hidden shadow-lg ${
                                theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                              }`}
                            >
                              <div className="relative">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-48 object-cover"
                                />
                                <motion.button
                                  onClick={() => handleDeletePost(item.id)}
                                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  🗑️
                                </motion.button>
                              </div>
                              <div className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-bold text-lg mb-1">
                                      {item.title}
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                                      {item.description}
                                    </p>
                                  </div>
                                  <span className="font-bold text-blue-600">
                                    ${item.price.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-sm">
                                    Size: {item.size}
                                  </span>
                                  <div className="flex items-center">
                                    <span className="text-sm mr-2">
                                      {item.likes} likes
                                    </span>
                                    <span>❤️</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <motion.div
                          className="flex flex-col items-center justify-center py-12"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <div className="text-5xl mb-4">👕</div>
                          <h3 className="text-xl font-bold mb-2">
                            No items listed yet
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 mb-4">
                            You haven't posted any items to the marketplace yet
                          </p>
                          <motion.button
                            onClick={() => setActiveTab('post')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            whileHover={{ scale: 1.05 }}
                          >
                            Post Your First Item
                          </motion.button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          <footer
            className={`py-8 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
            } relative z-10`}
          >
            <div className="container mx-auto px-4 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} ThreadVault Clothing Marketplace.
                All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </motion.div>
  );
}

