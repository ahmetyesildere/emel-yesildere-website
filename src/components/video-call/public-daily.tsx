'use client';

import React, { useEffect, useState } from 'react';

interface PublicDailyProps {
  sessionId: string;
  userName: string;
  userRole: 'client' | 'consultant';
}

export default function PublicDaily({ sessionId, userName, userRole }: PublicDailyProps) {
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const setupPublicRoom = async () => {
      try {
        console.log('🏠 Setting up PUBLIC Daily.co room for session:', sessionId);
        setIsLoading(true);
        
        const DAILY_API_KEY = '105e91b8ba6addfbea0912c289dc1f583a049934e24e836370f827b7dc959c80';
        const DAILY_API_URL = 'https://api.daily.co/v1';
        const roomName = `public-session-${sessionId}`;
        
        // Create PUBLIC room (not private)
        const roomData = {
          name: roomName,
          privacy: 'public', // PUBLIC ROOM!
          properties: {
            max_participants: 2,
            enable_chat: true, // Chat enabled
            enable_screenshare: true,
            enable_recording: false,
            enable_knocking: false, // No knocking for public rooms
            enable_prejoin_ui: false, // Skip prejoin UI
            enable_network_ui: true, // Show network status
            enable_people_ui: true // Show participants panel
          }
        };

        console.log('📤 Creating PUBLIC room:', roomName);
        
        const response = await fetch(DAILY_API_URL + '/rooms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DAILY_API_KEY}`
          },
          body: JSON.stringify(roomData)
        });

        let roomUrl = '';
        
        if (!response.ok) {
          if (response.status === 409 || response.status === 400) {
            console.log('🔄 Public room already exists, using it');
            roomUrl = `https://emelyesildere.daily.co/${roomName}`;
            console.log('✅ Using existing public room:', roomUrl);
          } else {
            const errorText = await response.text();
            throw new Error(`API Error: ${response.status} - ${errorText}`);
          }
        } else {
          const room = await response.json();
          console.log('✅ Public room created:', room.url);
          roomUrl = room.url;
        }

        // No token needed for public rooms!
        console.log('🎉 Public room ready - no token needed!');
        
        // Add chat parameters to URL - Daily.co specific parameters
        const urlWithParams = `${roomUrl}?t=${Date.now()}&userName=${encodeURIComponent(userName)}&userRole=${userRole}&showChat=true&showParticipants=true&theme=dark`;
        setRoomUrl(urlWithParams);
        setError(null);
        
      } catch (err: any) {
        console.error('❌ Public room setup failed:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    setupPublicRoom();
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">Setting up public room...</h3>
          <p className="text-gray-300">No authentication needed</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-red-50 border border-red-200 rounded-lg flex items-center justify-center">
        <div className="text-center text-red-600 p-6">
          <h3 className="text-lg font-semibold mb-2">Setup Failed</h3>
          <p className="text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!roomUrl) {
    return (
      <div className="w-full h-full bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-center">
        <div className="text-center text-yellow-600 p-6">
          <h3 className="text-lg font-semibold mb-2">Room Not Ready</h3>
          <p className="text-sm">Unable to setup public room</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      {/* Success header */}
      <div className="p-3 bg-green-600 text-white text-center text-sm">
        🎉 PUBLIC Daily.co Room | {userName} ({userRole}) | Session: {sessionId.slice(-8)}
      </div>
      
      {/* Daily.co iframe */}
      <iframe
        ref={(iframe) => {
          if (iframe) {
            iframe.onload = () => {
              console.log('✅ Public Daily.co iframe loaded successfully');
              console.log('🔧 Chat should be enabled by room properties');
              
              // Listen for messages from Daily.co iframe
              const handleMessage = (event: MessageEvent) => {
                if (event.origin !== 'https://emelyesildere.daily.co') return;
                console.log('📨 Message from Daily.co:', event.data);
              };
              
              window.addEventListener('message', handleMessage);
              
              // Cleanup listener
              return () => window.removeEventListener('message', handleMessage);
            };
          }
        }}
        src={roomUrl}
        width="100%"
        height="600px"
        style={{ 
          border: 'none',
          maxHeight: '70vh'
        }}
        allow="camera; microphone; fullscreen; display-capture; autoplay"
        allowFullScreen
        title={`Daily.co Public Video Call - Session ${sessionId}`}
        onError={(e) => console.error('❌ Public Daily.co iframe error:', e)}
      />
      
      {/* Debug info and fallback link */}
      <div className="p-2 bg-gray-800 text-center space-y-2">
        <div className="text-xs text-gray-400">
          💬 Chat enabled in room properties | 👥 Participants panel enabled
        </div>
        <a 
          href={roomUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 text-sm underline block"
        >
          Open public room in new tab (if chat not visible)
        </a>
        <div className="text-xs text-yellow-400">
          ⚠️ If chat messages not visible, try refreshing or opening in new tab
        </div>
      </div>
    </div>
  );
}