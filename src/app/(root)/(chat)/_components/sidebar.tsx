"use client"

import React, { useState, useEffect } from 'react'
import { Search, MessageSquare, ChevronDown, Plus, Trash2, Pencil } from 'lucide-react'
import Image from 'next/image'
import logo from "../../../../../public/logo.png"
import { fetchChats, deleteById, renameChatById } from '@/actions/chat_actions'
import toast from 'react-hot-toast'

interface Chat {
  id: string
  name: string
  description?: string
}

const sidebar = () => {
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(true)
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadChats()
  }, [])

  const loadChats = async () => {
    try {
      setLoading(true)
      const data = await fetchChats()
      // Assuming the API returns chats in a specific format
      // Adjust based on your actual API response structure
      if (data && Array.isArray(data)) {
        setChats(data)
      } else if (data?.chats && Array.isArray(data.chats)) {
        setChats(data.chats)
      }
    } catch (error) {
      console.error('Error loading chats:', error)
      toast.error('Failed to load chats')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (chatId: string) => {
    if (!confirm('Are you sure you want to delete this chat?')) {
      return
    }

    try {
      await deleteById(`/api/chat/delete?id=${chatId}`)
      toast.success('Chat deleted successfully')
      // Remove the chat from the list
      setChats(chats.filter(chat => chat.id !== chatId))
    } catch (error) {
      console.error('Error deleting chat:', error)
      toast.error('Failed to delete chat')
    }
  }

  const handleRename = async (chatId: string) => {
    if (!editName.trim()) {
      toast.error('Chat name cannot be empty')
      return
    }

    try {
      await renameChatById(chatId, editName.trim())
      toast.success('Chat renamed successfully')
      // Update the chat in the list
      setChats(chats.map(chat => 
        chat.id === chatId ? { ...chat, name: editName.trim() } : chat
      ))
      setEditingChatId(null)
      setEditName('')
    } catch (error) {
      console.error('Error renaming chat:', error)
      toast.error('Failed to rename chat')
    }
  }

  const startEditing = (chat: Chat) => {
    setEditingChatId(chat.id)
    setEditName(chat.name)
  }

  const cancelEditing = () => {
    setEditingChatId(null)
    setEditName('')
  }

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="">
          {/* My Chats header */}
          <div className="p-4">
            <div className="bg-zinc-800 rounded-full p-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 relative">
                  <Image src={logo} alt="logo"/>
                </div>
                <span className="text-white font-medium">History</span>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="px-4 mb-2">
            <div className="bg-zinc-800 rounded-md flex items-center px-3 py-2">
              <Search className="w-4 h-4 text-zinc-400 mr-2" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-zinc-300 text-sm w-full focus:outline-none"
              />
            </div>
          </div>


          {/* Chats */}
          <div className="px-4 mb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-zinc-400 text-sm">Chats</span>
              <button className="text-zinc-400">
                <ChevronDown/>
              </button>
            </div>

            <div className="space-y-2">
              {loading ? (
                <div className="text-zinc-400 text-sm text-center py-4">Loading chats...</div>
              ) : filteredChats.length === 0 ? (
                <div className="text-zinc-400 text-sm text-center py-4">No chats found</div>
              ) : (
                filteredChats.map((chat) => (
                  <div 
                    key={chat.id} 
                    className="bg-zinc-800 rounded-md p-2 flex justify-between items-center group hover:bg-zinc-700 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      {editingChatId === chat.id ? (
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleRename(chat.id)
                              } else if (e.key === 'Escape') {
                                cancelEditing()
                              }
                            }}
                            className="bg-zinc-700 text-zinc-300 text-sm px-2 py-1 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                            autoFocus
                          />
                          <button
                            onClick={() => handleRename(chat.id)}
                            className="text-green-400 hover:text-green-300 text-xs px-2"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="text-zinc-400 hover:text-zinc-300 text-xs px-2"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                            <span className="text-zinc-300 text-sm truncate">{chat.name}</span>
                          </div>
                          {chat.description && (
                            <p className="text-zinc-500 text-xs ml-6 truncate">{chat.description}</p>
                          )}
                        </>
                      )}
                    </div>
                    {editingChatId !== chat.id && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEditing(chat)}
                          className="text-zinc-400 hover:text-blue-400 p-1 transition-colors"
                          title="Rename chat"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDelete(chat.id)}
                          className="text-zinc-400 hover:text-red-400 p-1 transition-colors"
                          title="Delete chat"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* New chat button */}
          <div className="mt-auto px-4 pb-4">
            <button className="bg-green-500 hover:bg-green-600 text-white rounded-full py-2 px-4 w-full flex items-center justify-between">
              <span>New chat</span>
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
  )
}

export default sidebar