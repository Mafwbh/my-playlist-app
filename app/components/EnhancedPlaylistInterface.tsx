'use client'

import { useState, useEffect, useRef } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat } from 'lucide-react'

interface Song {
  id: number
  title: string
  artist: string
  duration: string
  file: string
}

export default function EnhancedPlaylistInterface() {
  const [songs, setSongs] = useState<Song[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Simulating fetching songs from your folder
    const fetchedSongs = [
      {
        id: 1,
        title: "Quantum Mechanics",
        artist: "Unknown Artist",
        duration: "3:00",
        file: "/music/quantum-mechanics.mp3"
      }
    ]
    setSongs(fetchedSongs)
  }, [])

  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const playSong = (song: Song) => {
    setCurrentSong(song)
    setIsPlaying(true)
    setCurrentTime(0)
  }

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const nextSong = () => {
    if (currentSong) {
      const currentIndex = songs.findIndex(song => song.id === currentSong.id)
      const nextIndex = (currentIndex + 1) % songs.length
      setCurrentSong(songs[nextIndex])
      setCurrentTime(0)
    }
  }

  const prevSong = () => {
    if (currentSong) {
      const currentIndex = songs.findIndex(song => song.id === currentSong.id)
      const prevIndex = (currentIndex - 1 + songs.length) % songs.length
      setCurrentSong(songs[prevIndex])
      setCurrentTime(0)
    }
  }

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.file
      if (isPlaying) {
        audioRef.current.play()
      }
    }
  }, [currentSong, isPlaying])

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      const updateTime = () => setCurrentTime(Math.floor(audio.currentTime))
      audio.addEventListener('timeupdate', updateTime)
      return () => audio.removeEventListener('timeupdate', updateTime)
    }
  }, [])

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-lg overflow-hidden border border-border bg-card flex flex-col" style={{ height: '80vh' }}>
        {/* Window chrome */}
        <div className="bg-muted px-4 py-2 flex items-center justify-between border-b border-border">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="bg-background px-6 py-1 rounded-md text-sm text-muted-foreground min-w-[120px] text-center">
            ours.vercel.app
          </div>
          <div className="w-[52px]" />
        </div>
        
        <div className="flex-grow flex flex-col overflow-hidden">
          <div className="p-4">
            <Input
              type="text"
              placeholder="Search songs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-input border-input"
            />
          </div>
          <div className="flex-grow overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border">
                  <TableHead className="bg-card sticky top-0 z-10 w-16">#</TableHead>
                  <TableHead className="bg-card sticky top-0 z-10">Title</TableHead>
                  <TableHead className="bg-card sticky top-0 z-10">Artist</TableHead>
                  <TableHead className="bg-card sticky top-0 z-10">Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSongs.map((song) => (
                  <TableRow 
                    key={song.id} 
                    className={`hover:bg-muted/50 border-b border-border cursor-pointer ${currentSong?.id === song.id ? 'bg-muted' : ''}`}
                    onClick={() => playSong(song)}
                  >
                    <TableCell>{song.id}</TableCell>
                    <TableCell className="font-medium">{song.title}</TableCell>
                    <TableCell>{song.artist}</TableCell>
                    <TableCell>{song.duration}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <div className="bg-muted p-3 border-t border-border">
          <div className="flex justify-between items-center mb-2">
            <div className="font-medium">{currentSong ? `${currentSong.title} - ${currentSong.artist}` : 'No song selected'}</div>
            <div className="text-muted-foreground">
              {currentSong ? 
                `${Math.floor(currentTime / 60)}:${(currentTime % 60).toString().padStart(2, '0')} / ${currentSong.duration}` 
                : '0:00 / 0:00'}
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => {}}>
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={prevSong}>
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={togglePlayPause}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={nextSong}>
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => {}}>
              <Repeat className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <audio ref={audioRef} onEnded={nextSong} />
    </div>
  )
}

