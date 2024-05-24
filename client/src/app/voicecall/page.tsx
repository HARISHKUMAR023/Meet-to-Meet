"use client"
import React, { useRef, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:5000');

interface SignalData {
    from: string;
    signal: RTCSessionDescriptionInit | RTCIceCandidate;
}

interface UserJoinedData {
    id: string;
}

const WebRTC: React.FC = () => {
    const localAudioRef = useRef<HTMLAudioElement>(null);
    const remoteAudioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
    const peerConnections = useRef<{ [key: string]: RTCPeerConnection }>({});
    const [room, setRoom] = useState<string>('');
    const [joined, setJoined] = useState<boolean>(false);
    const [muted, setMuted] = useState(false);
    useEffect(() => {
        socket.on('signal', async (data: SignalData) => {
            const peerConnection = peerConnections.current[data.from];
            if (!peerConnection) {
                await createPeerConnection(data.from, false);
            }
        
            try {
                if ('type' in data.signal && data.signal.type === 'offer') {
                    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.signal));
                    const answer = await peerConnection.createAnswer();
                    await peerConnection.setLocalDescription(answer);
                    socket.emit('signal', { to: data.from, signal: peerConnection.localDescription });
                } else if ('type' in data.signal && data.signal.type === 'answer') {
                    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.signal));
                } else if ('candidate' in data.signal) {
                    await peerConnection.addIceCandidate(new RTCIceCandidate(data.signal));
                }
            } catch (error) {
                console.error('Error processing signal:', error);
            }
        });
        
        socket.on('user-joined', async (data: UserJoinedData) => {
            console.log(`User joined: ${data.id}`);
            await createPeerConnection(data.id, true);
        });

        socket.on('user-left', (id: string) => {
            console.log(`User left: ${id}`);
            if (peerConnections.current[id]) {
                peerConnections.current[id].close();
                delete peerConnections.current[id];
                if (remoteAudioRefs.current[id]) {
                    remoteAudioRefs.current[id].remove();
                    delete remoteAudioRefs.current[id];
                }
            }
        });
    }, []);

    const createPeerConnection = async (id: string, isInitiator: boolean) => {
        const peerConnection = new RTCPeerConnection();

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('signal', { to: id, signal: event.candidate });
            }
        };

        peerConnection.ontrack = (event) => {
            if (!remoteAudioRefs.current[id]) {
                const audio = document.createElement('audio');
                audio.id = `remoteAudio-${id}`;
                audio.autoplay = true;
                document.body.appendChild(audio);
                remoteAudioRefs.current[id] = audio;
            }
            remoteAudioRefs.current[id].srcObject = event.streams[0];
        };

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (localAudioRef.current) {
            localAudioRef.current.srcObject = stream;
        }
        stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

        if (isInitiator) {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            socket.emit('signal', { to: id, signal: peerConnection.localDescription });
        }

        peerConnections.current[id] = peerConnection;
    };

    const startCall = async () => {
        socket.emit('join', room);
        setJoined(true);
    };
    const leaveCall = () => {
        socket.emit('leave', room);
        setJoined(false);
    };
    const toggleMute = () => {
        setMuted(!muted);
        if (localAudioRef.current) {
            localAudioRef.current.muted = !muted;
        }
    };
    return (
        <div>
            <h1 className='text-center font-bold bg-teal-900 text-white p-4 rounded-sm'>WebRTC Audio Call</h1>
            <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Room ID"
                className='p-3 m-2 border border-gray-300 rounded-sm '
            />
            <br />
            <button onClick={startCall} disabled={joined} className='bg-green-700 text-white p-3 rounded-sm'>Join Call</button>
            <audio ref={localAudioRef} autoPlay muted />
            <button onClick={toggleMute} className='bg-blue-500 text-white p-3 m-2 rounded-sm'>{muted ? 'Unmute' : 'Mute'}</button>
            <button onClick={leaveCall} disabled={!joined} className='bg-red-500 text-white p-3 m-2 rounded-sm'>Leave Call</button>
            {/* Remote audio elements will be created dynamically */}
        </div>
    );
};

export default WebRTC;
