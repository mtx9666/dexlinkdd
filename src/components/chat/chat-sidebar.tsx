'use client';

import { useState } from 'react';
import { MessageSquare, X, Send, ChevronLeft, ChevronRight, Users, Hash, Globe, TrendingUp, Star, ThumbsUp, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Message {
  id: string;
  user: {
    name: string;
    avatar?: string;
    isOnline?: boolean;
  };
  content: string;
  timestamp: string;
  reactions?: {
    likes: number;
    hasLiked?: boolean;
  };
}

interface ChatRoom {
  id: string;
  name: string;
  icon: React.ReactNode;
  unreadCount?: number;
}

export function ChatSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [activeRoom, setActiveRoom] = useState('general');
  
  const chatRooms: ChatRoom[] = [
    { id: 'general', name: 'General', icon: <Globe className="h-4 w-4" /> },
    { id: 'trading', name: 'Trading', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'signals', name: 'Signals', icon: <Hash className="h-4 w-4" />, unreadCount: 3 },
  ];

  const onlineUsers = [
    { id: '1', name: 'John Doe', avatar: '/avatars/trader1.jpg', status: 'Trading BTC' },
    { id: '2', name: 'Jane Smith', avatar: '/avatars/trader2.jpg', status: 'Online' },
    { id: '3', name: 'Alex Wilson', status: 'Analyzing charts' },
  ];

  const [messages] = useState<Message[]>([
    {
      id: '1',
      user: { 
        name: 'John Doe', 
        avatar: '/avatars/trader1.jpg',
        isOnline: true 
      },
      content: 'BTC looking bullish today! 🚀',
      timestamp: '2 min ago',
      reactions: { likes: 2, hasLiked: false }
    },
    {
      id: '2',
      user: { 
        name: 'Jane Smith',
        isOnline: true 
      },
      content: 'Yeah, the support at 45k seems strong',
      timestamp: '1 min ago',
      reactions: { likes: 1, hasLiked: true }
    }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    // TODO: Implement message sending logic
    setMessage('');
  };

  const handleReaction = (messageId: string) => {
    // TODO: Implement reaction logic
    console.log('Toggle reaction for message:', messageId);
  };

  const handleShare = (messageId: string) => {
    // TODO: Implement share logic
    console.log('Share message:', messageId);
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed right-0 top-20 z-40 flex items-center justify-center rounded-l-lg bg-card p-2 text-gray-400 hover:text-white transition-transform duration-200",
          isOpen && "translate-x-[336px]"
        )}
      >
        {isOpen ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </button>

      {/* Chat sidebar */}
      <div
        className={cn(
          "fixed right-0 top-16 z-30 h-[calc(100vh-4rem)] w-80 transform bg-card transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <Tabs defaultValue="chat" className="h-full">
          <div className="flex h-14 items-center justify-between border-b border-gray-800 px-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chat" className="flex items-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Online
              </TabsTrigger>
            </TabsList>
            <Button variant="ghost" size="sm" className="ml-2" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <TabsContent value="chat" className="h-[calc(100%-3.5rem)] flex flex-col">
            {/* Chat rooms */}
            <div className="flex space-x-1 p-2 overflow-x-auto border-b border-gray-800">
              {chatRooms.map((room) => (
                <Button
                  key={room.id}
                  variant={activeRoom === room.id ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center whitespace-nowrap"
                  onClick={() => setActiveRoom(room.id)}
                >
                  {room.icon}
                  <span className="ml-1">{room.name}</span>
                  {room.unreadCount && (
                    <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-xs">
                      {room.unreadCount}
                    </span>
                  )}
                </Button>
              ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="group relative flex items-start space-x-3">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={msg.user.avatar} />
                      <AvatarFallback>{msg.user.name[0]}</AvatarFallback>
                    </Avatar>
                    {msg.user.isOnline && (
                      <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-success ring-2 ring-background" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-sm font-medium">{msg.user.name}</h3>
                      <span className="text-xs text-gray-400">{msg.timestamp}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-300">{msg.content}</p>
                    <div className="mt-1 flex items-center space-x-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => handleReaction(msg.id)}
                        className={cn(
                          "flex items-center space-x-1 text-xs",
                          msg.reactions?.hasLiked ? "text-primary" : "text-gray-400 hover:text-white"
                        )}
                      >
                        <ThumbsUp className="h-3 w-3" />
                        <span>{msg.reactions?.likes || 0}</span>
                      </button>
                      <button
                        onClick={() => handleShare(msg.id)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Share2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form 
              onSubmit={handleSendMessage}
              className="border-t border-gray-800 bg-background p-4"
            >
              <div className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="users" className="h-[calc(100%-3.5rem)]">
            <div className="p-4 space-y-4">
              {onlineUsers.map((user) => (
                <div key={user.id} className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-success ring-2 ring-background" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">{user.name}</h3>
                    <p className="text-xs text-gray-400">{user.status}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
} 