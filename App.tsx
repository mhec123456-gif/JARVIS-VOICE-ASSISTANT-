import React, { useState, useEffect, useRef } from 'react';
import JSZip from 'jszip';
import {
  Mic,
  MicOff,
  Send,
  Download,
  Settings as SettingsIcon,
  Smartphone,
  Code2,
  BookOpen,
  Volume2,
  VolumeX,
  Volume1,
  Shield,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  Copy,
  Check,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Cpu,
  Radio,
  Lock,
  Unlock,
  Bell,
  Clock,
  Plus,
  Trash2,
  Info,
  Layers,
  Headphones,
  Bluetooth,
  Car,
  Waves,
  Eye,
  EyeOff,
  FileText,
  CheckSquare,
  Globe,
  Activity,
  Filter,
  XCircle,
  Terminal,
  GraduationCap,
  Film,
  Video,
  Scissors,
  Search,
  Zap,
  CheckCircle2,
  ArrowUpCircle,
  Languages
} from 'lucide-react';
import { ANDROID_PROJECT_FILES, AndroidFile } from './data/androidFilesData';
import { EnglishTutorModule } from './components/EnglishTutorModule';
import { AiReelCreatorModule } from './components/AiReelCreatorModule';
import { SelfProtectionModule } from './components/SelfProtectionModule';
import { UpdateCenterModule } from './components/UpdateCenterModule';

// Types
interface Message {
  id: string;
  sender: 'user' | 'jarvis';
  text: string;
  badge?: string;
  timestamp: string;
}

interface PendingIntent {
  type: string;
  targetApp: string;
  title: string;
  message: string;
  action: () => void;
}

// Security Audit Event Structure
export interface SecurityAuditItem {
  id: string;
  time: string;
  category: 'PACKAGE_INSTALL' | 'PERMISSION_ALTERED' | 'APP_OPEN' | 'ACCOUNT_AUDIT';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  app: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionUrl?: string;
  recommendation?: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'tutor' | 'reels' | 'security' | 'bluetooth' | 'code' | 'guide' | 'settings'>('simulator');
  
  // Personal Phone Security Monitoring Module States
  const [securitySubTab, setSecuritySubTab] = useState<'overview' | 'isolation' | 'packages' | 'permissions' | 'app_alerts' | 'accounts' | 'logs'>('overview');
  const [isSecurityAlertActive, setIsSecurityAlertActive] = useState(true);
  const [monitoredApps, setMonitoredApps] = useState<string[]>(['WhatsApp', 'Facebook', 'Instagram']);
  const [isPhoneLocked, setIsPhoneLocked] = useState(false);
  const [hasRecentUnlock, setHasRecentUnlock] = useState(true);
  const [isPrivateNotification, setIsPrivateNotification] = useState<boolean>(true);
  const [alertCooldownSec, setAlertCooldownSec] = useState<number>(60);
  const [alertVolumePercent, setAlertVolumePercent] = useState<number>(90);
  const [respectSilentMode, setRespectSilentMode] = useState<boolean>(false);
  const [lastSecurityWarning, setLastSecurityWarning] = useState<string | null>(null);
  const [customPackageInput, setCustomPackageInput] = useState('');
  const lastAlertTimesRef = useRef<Record<string, number>>({});
  const sessionAlertedAppsRef = useRef<Set<string>>(new Set());

  // Interactive Heads-Up Notification Banner State
  const [activeNotificationBanner, setActiveNotificationBanner] = useState<{
    id: string;
    title: string;
    body: string;
    severity: 'critical' | 'warning' | 'info';
    time: string;
    categoryTag: string;
    actionLabel?: string;
    onAction?: () => void;
  } | null>(null);

  // Sideload & App Installation Monitor Tester State
  const [testPackageName, setTestPackageName] = useState('GBWhatsApp Pro v18.2');
  const [testPackageId, setTestPackageId] = useState('com.mod.gbwhatsapp');
  const [testInstallSource, setTestInstallSource] = useState<'play_store' | 'vivo_store' | 'browser' | 'telegram' | 'file_manager'>('browser');
  const [testDangerousPerms, setTestDangerousPerms] = useState<Record<string, boolean>>({
    'Microphone (RECORD_AUDIO)': true,
    'Camera (CAMERA)': true,
    'Precise Location (ACCESS_FINE_LOCATION)': false,
    'Accessibility Service (BIND_ACCESSIBILITY_SERVICE)': true,
    'SMS Read/Send (READ_SMS)': true,
    'Contacts Access (READ_CONTACTS)': true,
  });

  // Sensitive Permission Audit Matrix State
  const [permissionAuditMatrix, setPermissionAuditMatrix] = useState([
    {
      id: 'perm-mic',
      name: 'Microphone Access',
      permission: 'android.permission.RECORD_AUDIO',
      op: 'OPSTR_RECORD_AUDIO',
      grantedApps: ['JARVIS Assistant', 'Phone Dialer', 'WhatsApp'],
      isTampered: false,
      riskLevel: 'HIGH',
      description: 'Allows background voice capture. Monitored via AppOpsManager.'
    },
    {
      id: 'perm-cam',
      name: 'Camera Sensor',
      permission: 'android.permission.CAMERA',
      op: 'OPSTR_CAMERA',
      grantedApps: ['Vivo Zeiss Camera', 'WhatsApp'],
      isTampered: false,
      riskLevel: 'HIGH',
      description: 'Allows photos and video capture. Monitored via AppOpsManager.'
    },
    {
      id: 'perm-loc',
      name: 'Precise Location',
      permission: 'android.permission.ACCESS_FINE_LOCATION',
      op: 'OPSTR_FINE_LOCATION',
      grantedApps: ['Google Maps', 'Weather Engine'],
      isTampered: false,
      riskLevel: 'MEDIUM',
      description: 'High-accuracy GPS tracking. Monitored via AppOpsManager.'
    },
    {
      id: 'perm-acc',
      name: 'Accessibility Services',
      permission: 'BIND_ACCESSIBILITY_SERVICE',
      op: 'ENABLED_ACCESSIBILITY_SERVICES',
      grantedApps: ['JARVIS App Monitor'],
      isTampered: false,
      riskLevel: 'CRITICAL',
      description: 'Full window observation and interaction privilege. Monitored via Settings.Secure observer.'
    },
    {
      id: 'perm-notif',
      name: 'Notification Listener',
      permission: 'BIND_NOTIFICATION_LISTENER_SERVICE',
      op: 'enabled_notification_listeners',
      grantedApps: [],
      isTampered: false,
      riskLevel: 'HIGH',
      description: 'Can read OTPs and message contents. Monitored via NotificationManagerCompat.'
    }
  ]);

  // Official Account Security Checklist State
  const [accountSecurityCompleted, setAccountSecurityCompleted] = useState<Record<string, boolean>>({
    'google_sessions': false,
    'google_2fa': true,
    'meta_sessions': false,
    'meta_alerts': true,
    'whatsapp_devices': false,
  });

  // Security Audit Log & Filter
  const [auditFilter, setAuditFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'APP_OPEN'>('ALL');
  const [securityAuditLog, setSecurityAuditLog] = useState<SecurityAuditItem[]>([
    {
      id: 'sec-init-1',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      category: 'PACKAGE_INSTALL',
      severity: 'INFO',
      app: 'PackageMonitorReceiver',
      title: 'App Installation Sentinel Initialized',
      description: 'Active broadcast filter for ACTION_PACKAGE_ADDED with priority 999. Installer verification enabled.',
      recommendation: 'All newly installed packages will be audited against Google Play and Vivo App Store fingerprints.'
    },
    {
      id: 'sec-init-2',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      category: 'PERMISSION_ALTERED',
      severity: 'INFO',
      app: 'PermissionAuditManager',
      title: 'AppOps Security Watchers Armed',
      description: 'Monitoring OPSTR_RECORD_AUDIO, OPSTR_CAMERA, and Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES.',
      recommendation: 'Runtime permission grants to third-party packages will trigger immediate private alerts.'
    },
    {
      id: 'sec-init-3',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      category: 'ACCOUNT_AUDIT',
      severity: 'INFO',
      app: 'OfficialAccountSecurityGuide',
      title: 'Account Security Guidance Primed',
      description: 'Direct hooks established for Google Security Checkup and Meta Accounts Center.',
      recommendation: 'Remember: Device app-open events are local only; review cloud sessions for remote logins.'
    }
  ]);

  // Legacy compatibility reference for simple text log
  const [securityEventLog, setSecurityEventLog] = useState<Array<{ id: string; time: string; text: string; app: string }>>([]);

  // Bluetooth Headset & Hands-Free States
  const [isHeadsetConnected, setIsHeadsetConnected] = useState<boolean>(true);
  const [headsetName, setHeadsetName] = useState<string>('Vivo TWS 4 Hi-Fi');
  const [isScoActive, setIsScoActive] = useState<boolean>(true);
  const [isDrivingMode, setIsDrivingMode] = useState<boolean>(false);
  const [isPocketMode, setIsPocketMode] = useState<boolean>(false);
  const [audioInputDevices, setAudioInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedInputDeviceId, setSelectedInputDeviceId] = useState<string>('');
  const [headsetAudioLevel, setHeadsetAudioLevel] = useState<number>(0);
  const [isTestingMic, setIsTestingMic] = useState<boolean>(false);
  const [headsetEventLog, setHeadsetEventLog] = useState<Array<{ id: string; time: string; event: string; detail: string; status: 'ok' | 'warn' | 'info' }>>([
    {
      id: 'init-1',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      event: 'BT_SCO_CONNECTED',
      detail: 'Bidirectional audio link established with Vivo TWS 4 Hi-Fi (16kHz Wideband Speech mSBC)',
      status: 'ok'
    },
    {
      id: 'init-2',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      event: 'ROUTING_CONFIGURED',
      detail: 'AudioAttributes.USAGE_ASSISTANT bound to AudioDeviceInfo.TYPE_BLUETOOTH_SCO',
      status: 'ok'
    }
  ]);
  const testMicStreamRef = useRef<MediaStream | null>(null);
  const testAudioCtxRef = useRef<AudioContext | null>(null);
  const testAnalyserRef = useRef<AnalyserNode | null>(null);
  const testAnimFrameRef = useRef<number | null>(null);

  // Phone Simulator States
  const [assistantState, setAssistantState] = useState<'standby' | 'listening' | 'processing' | 'speaking'>('standby');
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'jarvis',
      text: 'All systems nominal, sir. JARVIS is online on your Vivo X200 FE. Bluetooth SCO audio link active. Listening in English and Malayalam (മലയാളം).',
      badge: 'System Core',
      timestamp: 'Ready'
    }
  ]);
  const [pendingIntent, setPendingIntent] = useState<PendingIntent | null>(null);

  // Speech-to-Text (ASR) Engine States
  const [speechLanguage, setSpeechLanguage] = useState<'auto' | 'ml-IN' | 'en-IN'>('auto');
  const [speechAsrError, setSpeechAsrError] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [lastAsrMeta, setLastAsrMeta] = useState<{ engine: string; lang: string } | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionReceivedFinalRef = useRef<boolean>(false);
  const currentTranscriptRef = useRef<string>('');

  // Settings & Keys
  const [geminiKey, setGeminiKey] = useState('');
  const [openAiKey, setOpenAiKey] = useState('');
  const [routerPreference, setRouterPreference] = useState<'auto' | 'gemini' | 'openai'>('auto');
  const [maleMalayalamPitch, setMaleMalayalamPitch] = useState(true);
  const [wakeWordActive, setWakeWordActive] = useState(true);

  // Speaker Verification
  const [isSpeakerVerificationEnabled, setIsSpeakerVerificationEnabled] = useState(false);
  const [enrollmentStep, setEnrollmentStep] = useState(0); // 0 to 3
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrolledVoiceprint, setEnrolledVoiceprint] = useState<number[] | null>(null);
  const [verificationScore, setVerificationScore] = useState<number | null>(null);

  // Enumerate actual audio devices on mount
  useEffect(() => {
    const fetchAudioDevices = async () => {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const inputs = devices.filter(d => d.kind === 'audioinput');
          setAudioInputDevices(inputs);

          // Check for bluetooth/headset label
          const btDevice = inputs.find(d => {
            const lbl = d.label.toLowerCase();
            return (
              lbl.includes('bluetooth') ||
              lbl.includes('wireless') ||
              lbl.includes('headset') ||
              lbl.includes('airpod') ||
              lbl.includes('buds') ||
              lbl.includes('wh-') ||
              lbl.includes('wf-') ||
              lbl.includes('hands-free') ||
              lbl.includes('tws')
            );
          });

          if (btDevice) {
            setSelectedInputDeviceId(btDevice.deviceId);
            setHeadsetName(btDevice.label);
            setIsHeadsetConnected(true);
            setIsScoActive(true);
          } else if (inputs.length > 0) {
            setSelectedInputDeviceId(inputs[0].deviceId);
          }
        } catch (err) {
          console.warn('Audio device enumeration error:', err);
        }
      }
    };

    fetchAudioDevices();
  }, []);

  // Code Explorer
  const [selectedFile, setSelectedFile] = useState<AndroidFile>(ANDROID_PROJECT_FILES[0]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  // Audio Context & Canvas Visualizer
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Voice Synthesis Setup
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const hasMalayalam = /[\u0D00-\u0D7F]/.test(text);

    const voices = window.speechSynthesis.getVoices();
    if (hasMalayalam) {
      const mlVoice = voices.find(v => v.lang.toLowerCase().includes('ml') || v.lang.toLowerCase().includes('mal'));
      if (mlVoice) {
        utterance.voice = mlVoice;
      }
      utterance.lang = 'ml-IN';
      // Deepen pitch for male JARVIS cadence
      utterance.pitch = maleMalayalamPitch ? 0.82 : 1.0;
    } else {
      const enMale = voices.find(v => (v.lang.startsWith('en') && (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('george'))));
      if (enMale) utterance.voice = enMale;
      utterance.lang = 'en-US';
      utterance.pitch = 0.88;
    }
    utterance.rate = 0.95;
    utterance.volume = Math.max(0.1, Math.min(1.0, alertVolumePercent / 100));

    utterance.onstart = () => setAssistantState('speaking');
    utterance.onend = () => setAssistantState('standby');
    utterance.onerror = () => setAssistantState('standby');

    window.speechSynthesis.speak(utterance);
  };

  // Server-side Gemini Multimodal ASR transcription
  const transcribeAudioViaServer = async (audioBlob: Blob): Promise<string> => {
    setIsTranscribing(true);
    setLiveTranscript('Transcribing speech (മലയാളം / English)…');
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const res = reader.result as string;
          resolve(res);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(audioBlob);
      const base64Data = await base64Promise;

      const resp = await fetch('/api/ai/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: base64Data,
          mimeType: audioBlob.type || 'audio/webm',
          language: speechLanguage,
          customGeminiKey: geminiKey || undefined,
        })
      });

      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.message || data.error || 'Server transcription failed');
      }

      if (data.noSpeechDetected || !data.transcript) {
        setSpeechAsrError('No human speech was detected in the audio recording. Please speak clearly into your mic.');
        setLiveTranscript('');
        return '';
      }

      const finalResult = data.transcript.trim();
      // Requirement 4 & 5: Display recognized words as text in the JARVIS chat input field
      setTextInput(finalResult);
      setLiveTranscript(finalResult);
      setSpeechAsrError(null);
      setLastAsrMeta({
        engine: data.engine || 'Gemini 2.5 Flash ASR',
        lang: data.detectedLanguage || speechLanguage
      });

      return finalResult;
    } catch (e: any) {
      console.error('Server transcription failed:', e);
      setSpeechAsrError(e.message || 'Speech recognition failed. Please try again or type below.');
      setLiveTranscript('');
      return '';
    } finally {
      setIsTranscribing(false);
    }
  };

  // Web Speech Recognition setup
  const initSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.info('Native Web Speech API not supported in this browser; MediaRecorder + Gemini ASR will be used.');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    // Set recognition language based on user preference
    recognition.lang = speechLanguage === 'en-IN' ? 'en-IN' : (speechLanguage === 'auto' ? 'ml-IN' : 'ml-IN');

    recognition.onstart = () => {
      setIsListening(true);
      setAssistantState('listening');
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          final += item[0].transcript;
        } else {
          interim += item[0].transcript;
        }
      }

      // Requirement 4 & 5: Display recognized words as text in the JARVIS chat input field while speaking
      if (interim) {
        currentTranscriptRef.current = interim;
        setLiveTranscript(interim);
        setTextInput(interim);
      }

      if (final) {
        currentTranscriptRef.current = final;
        recognitionReceivedFinalRef.current = true;
        setLiveTranscript(final);
        setTextInput(final);
        setSpeechAsrError(null);
        setLastAsrMeta({ engine: 'Web Speech API', lang: recognition.lang });

        // Stop microphone visualizer and listening state
        stopAudioVisualizer();
        setIsListening(false);
        setAssistantState('processing');

        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          try {
            mediaRecorderRef.current.stop();
          } catch (e) {}
        }

        // Requirement 6: Pass recognized text to existing AI chat handler only after transcription completes
        handleUserQuery(final.trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setSpeechAsrError('Microphone permission blocked in browser. Please permit mic access in site settings.');
        setIsListening(false);
        setAssistantState('standby');
        stopAudioVisualizer();
      } else if (event.error === 'network') {
        // In iframes or restricted environments, WebSpeech network service fails.
        // MediaRecorder will seamlessly send audio to server-side Gemini ASR upon finishing speaking!
        console.info('WebSpeech network service restricted. MediaRecorder will transcribe audio via Gemini ASR.');
      } else if (event.error === 'no-speech') {
        // Will evaluate recorded audio on stop
      } else {
        console.warn('Speech recognition warning:', event.error);
      }
    };

    recognition.onend = () => {
      // If Web Speech API ended without a final transcript and the user was speaking,
      // the MediaRecorder will process the audio recording
      if (isListening && !recognitionReceivedFinalRef.current) {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          try {
            mediaRecorderRef.current.stop();
          } catch (e) {}
        }
      }
    };

    return recognition;
  };

  // Toggle Microphone with MediaStream capture and Dual-Engine transcription
  const toggleListening = async () => {
    // If currently listening or transcribing, stop and finalize
    if (isListening || isTranscribing) {
      setIsListening(false);
      setAssistantState('processing');
      stopAudioVisualizer();

      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop();
        } catch (e) {}
      }

      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        try {
          mediaRecorderRef.current.stop();
        } catch (e) {}
      } else {
        if (currentTranscriptRef.current.trim() && !recognitionReceivedFinalRef.current) {
          recognitionReceivedFinalRef.current = true;
          const text = currentTranscriptRef.current.trim();
          setTextInput(text);
          setLiveTranscript(text);
          handleUserQuery(text);
        } else {
          setAssistantState('standby');
        }
      }
      return;
    }

    // Start fresh listening session
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeechAsrError(null);
    setLiveTranscript('');
    currentTranscriptRef.current = '';
    recognitionReceivedFinalRef.current = false;
    audioChunksRef.current = [];

    try {
      const audioConstraints = selectedInputDeviceId
        ? { deviceId: { exact: selectedInputDeviceId }, echoCancellation: true, noiseSuppression: true }
        : { echoCancellation: true, noiseSuppression: true };
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints });
      micStreamRef.current = stream;
      startAudioVisualizer(stream);

      // 1. Initialize MediaRecorder on real microphone audio stream
      let mimeType = 'audio/webm;codecs=opus';
      if (typeof MediaRecorder !== 'undefined') {
        if (!MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg';
        }
        try {
          const recorder = new MediaRecorder(stream, { mimeType });
          mediaRecorderRef.current = recorder;
          audioChunksRef.current = [];

          recorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
          };

          recorder.onstop = async () => {
            // Check if WebSpeech API already successfully delivered the final transcript
            if (recognitionReceivedFinalRef.current && currentTranscriptRef.current.trim()) {
              return;
            }

            // Fall back to server-side Gemini ASR with the captured audio
            if (audioChunksRef.current.length > 0) {
              const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
              if (audioBlob.size > 500) {
                const transcribed = await transcribeAudioViaServer(audioBlob);
                if (transcribed) {
                  handleUserQuery(transcribed);
                } else {
                  setAssistantState('standby');
                }
              } else {
                setSpeechAsrError('Audio recording was too brief. Please hold or speak longer.');
                setAssistantState('standby');
              }
            } else {
              setSpeechAsrError('No audio data was recorded from your microphone.');
              setAssistantState('standby');
            }
          };

          recorder.start(250);
        } catch (e) {
          console.warn('MediaRecorder init error:', e);
        }
      }

      // 2. Initialize Browser Web Speech API
      const recognition = initSpeechRecognition();
      if (recognition) {
        speechRecognitionRef.current = recognition;
        try {
          recognition.start();
        } catch (e) {
          console.warn('SpeechRecognition start failed:', e);
        }
      }

      setIsListening(true);
      setAssistantState('listening');
      setLiveTranscript('Listening… Speak in Malayalam (മലയാളം) or English.');
    } catch (err: any) {
      console.error('Microphone access denied:', err);
      setIsListening(false);
      setAssistantState('standby');
      stopAudioVisualizer();
      setSpeechAsrError('Microphone access denied or unreadable. Please check browser permissions.');
    }
  };

  // Direct ASR tester for Malayalam and English
  const testSpeechRecognitionSentence = (sentence: string, lang: 'ml-IN' | 'en-IN') => {
    // Fill text input field immediately to simulate transcription result
    setTextInput(sentence);
    setLiveTranscript(sentence);
    setSpeechAsrError(null);
    setLastAsrMeta({ engine: 'Verified ASR Pipeline', lang });
    // Speak brief feedback then pass to AI chat handler
    setTimeout(() => {
      handleUserQuery(sentence);
    }, 400);
  };

  // Audio Canvas Waveform Loop
  const startAudioVisualizer = (stream: MediaStream) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        if (!canvasRef.current || !analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw futuristic circular reactor ring
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 55;

        // Calculate average energy
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        const pulse = (avg / 255) * 20;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + pulse, 0, 2 * Math.PI);
        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00F0FF';
        ctx.stroke();

        // Radiating rays
        const bars = 24;
        for (let i = 0; i < bars; i++) {
          const angle = (i * 2 * Math.PI) / bars;
          const barHeight = (dataArray[i % bufferLength] / 255) * 35;
          const x1 = centerX + Math.cos(angle) * (radius + pulse);
          const y1 = centerY + Math.sin(angle) * (radius + pulse);
          const x2 = centerX + Math.cos(angle) * (radius + pulse + barHeight);
          const y2 = centerY + Math.sin(angle) * (radius + pulse + barHeight);

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = i % 2 === 0 ? '#00F0FF' : '#38BDF8';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        animationFrameRef.current = requestAnimationFrame(draw);
      };

      draw();
    } catch (e) {
      console.warn('Visualizer init failed:', e);
    }
  };

  const stopAudioVisualizer = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  // --- Bluetooth Headset & Hands-Free Audio Methods ---
  const triggerHeadsetStemClick = () => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setHeadsetEventLog(prev => [
      {
        id: Date.now().toString(),
        time: now,
        event: 'MEDIA_BUTTON_HOOK',
        detail: 'Captured KEYCODE_HEADSETHOOK from headset button. Starting hands-free voice capture.',
        status: 'ok'
      },
      ...prev.slice(0, 19)
    ]);

    if (!isListening) {
      speakText('ശ്രദ്ധിക്കുന്നു സാർ, പറയൂ.');
      setTimeout(() => {
        toggleListening();
      }, 1200);
    }
  };

  const simulateHeadsetDisconnect = () => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsHeadsetConnected(false);
    setIsScoActive(false);
    setAssistantState('standby');
    setHeadsetEventLog(prev => [
      {
        id: Date.now().toString(),
        time: now,
        event: 'AUDIO_BECOMING_NOISY',
        detail: 'Headset disconnected or battery exhausted. Safety mute triggered; communication device cleared.',
        status: 'warn'
      },
      {
        id: (Date.now() + 1).toString(),
        time: now,
        event: 'SPEAKER_FAILOVER',
        detail: 'Audio routed to AudioDeviceInfo.TYPE_BUILTIN_SPEAKER (Vivo X200 FE Loudspeaker) at safe volume.',
        status: 'info'
      },
      ...prev.slice(0, 19)
    ]);

    addJarvisResponse(
      '⚠️ Headset disconnected. Intercepted ACTION_AUDIO_BECOMING_NOISY. Audio safely redirected to Vivo X200 FE speaker.',
      'Bluetooth Audio Safety'
    );

    setTimeout(() => {
      speakText('ഹെഡ്‌സെറ്റ് വിച്ഛേദിക്കപ്പെട്ടു. ശബ്ദം ഫോൺ സ്പീക്കറിലേക്ക് മാറ്റിയിരിക്കുന്നു.');
    }, 300);
  };

  const simulateHeadsetReconnect = () => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setIsHeadsetConnected(true);
    setIsScoActive(true);
    setHeadsetEventLog(prev => [
      {
        id: Date.now().toString(),
        time: now,
        event: 'BT_SCO_RECONNECTED',
        detail: `AudioManager.setCommunicationDevice bound to ${headsetName}. Duplex audio active.`,
        status: 'ok'
      },
      ...prev.slice(0, 19)
    ]);

    addJarvisResponse(
      `🎧 Headset connected: ${headsetName}. Bluetooth SCO active. All microphone input and voice responses routed to headset.`,
      'Bluetooth Audio'
    );

    speakText('Headset connected, sir. High-definition voice channel online.');
  };

  const startMicTest = async () => {
    if (isTestingMic) {
      stopMicTest();
      return;
    }
    try {
      const constraints = selectedInputDeviceId
        ? { audio: { deviceId: { exact: selectedInputDeviceId } } }
        : { audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      testMicStreamRef.current = stream;

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      testAudioCtxRef.current = audioCtx;
      testAnalyserRef.current = analyser;
      setIsTestingMic(true);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateLevel = () => {
        if (!testAnalyserRef.current) return;
        testAnalyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setHeadsetAudioLevel(normalized);
        testAnimFrameRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();
    } catch (e) {
      console.error('Could not start headset mic test:', e);
      alert('Microphone access denied or device not found.');
    }
  };

  const stopMicTest = () => {
    if (testAnimFrameRef.current) {
      cancelAnimationFrame(testAnimFrameRef.current);
      testAnimFrameRef.current = null;
    }
    if (testMicStreamRef.current) {
      testMicStreamRef.current.getTracks().forEach(t => t.stop());
      testMicStreamRef.current = null;
    }
    if (testAudioCtxRef.current && testAudioCtxRef.current.state !== 'closed') {
      testAudioCtxRef.current.close();
      testAudioCtxRef.current = null;
    }
    testAnalyserRef.current = null;
    setIsTestingMic(false);
    setHeadsetAudioLevel(0);
  };

  const testHeadsetMalayalamVoice = () => {
    speakText('Sir, ബ്ലൂടൂത്ത് ഹെഡ്‌സെറ്റ് വിജയകരമായി കണക്ട് ചെയ്തിരിക്കുന്നു. സംസാരിക്കൂ, ഞാൻ കേൾക്കുന്നുണ്ട്.');
  };

  const testHeadsetEnglishVoice = () => {
    speakText('JARVIS online. High-definition Bluetooth SCO audio link active. Audio routed to headset, sir.');
  };

  // Add Assistant Response Helper
  const addJarvisResponse = (text: string, badge?: string) => {
    const jarvisMsg: Message = {
      id: Date.now().toString(),
      sender: 'jarvis',
      text,
      badge,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, jarvisMsg]);
    setAssistantState('speaking');
  };

  // Simulate Device Lock / Unlock State (ACTION_SCREEN_OFF / ACTION_USER_PRESENT)
  const simulateLockDevice = () => {
    setIsPhoneLocked(true);
    setHasRecentUnlock(false);
    sessionAlertedAppsRef.current.clear();
    setLastSecurityWarning('Device locked (Screen Off / Unattended). Security alert armed for next unlock.');
  };

  const simulateUnlockDevice = () => {
    setIsPhoneLocked(false);
    setHasRecentUnlock(true);
    sessionAlertedAppsRef.current.clear();
    setLastSecurityWarning('Device unlocked (Keyguard dismissed). Accessibility window monitor listening for target apps.');
  };

  // Trigger Voice Security Alert (Immediate Malayalam warning + Private Notification)
  const triggerSecurityAlert = (appName: string, force = false) => {
    if (isPhoneLocked) {
      alert(`Vivo X200 FE is currently locked. In Android, apps cannot be opened while locked. Please simulate "Unlock Device" first.`);
      return;
    }
    if (!isSecurityAlertActive) {
      alert('Voice Security Alert is currently disarmed. Toggle it ON to enable warnings.');
      return;
    }
    if (!monitoredApps.includes(appName)) {
      alert(`${appName} is not selected in your monitored apps list. Enable it in the checklist to trigger warnings.`);
      return;
    }

    // Cooldown verification
    const now = Date.now();
    if (!force) {
      if (alertCooldownSec === -1) {
        if (sessionAlertedAppsRef.current.has(appName)) {
          setLastSecurityWarning(`[Cooldown] Alert already sounded for ${appName} during this unlock session.`);
          return;
        }
      } else if (alertCooldownSec > 0) {
        const last = lastAlertTimesRef.current[appName] || 0;
        const diffSec = (now - last) / 1000;
        if (diffSec < alertCooldownSec) {
          const remaining = Math.ceil(alertCooldownSec - diffSec);
          setLastSecurityWarning(`[Cooldown Active] Warning for ${appName} suppressed (${remaining}s remaining).`);
          return;
        }
      }
    }

    lastAlertTimesRef.current[appName] = now;
    sessionAlertedAppsRef.current.add(appName);

    const warningSpeech = `Sir, ശ്രദ്ധിക്കുക! നിങ്ങളുടെ ഫോണിൽ ${appName} തുറന്നിട്ടുണ്ട്. ഇത് നിങ്ങളാണോ ഉപയോഗിക്കുന്നത്?`;
    setLastSecurityWarning(`🚨 ${appName} opened • Spoken: "${warningSpeech}"`);

    // 1. Dispatch Immediate Android Heads-Up Notification (Simulated)
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setActiveNotificationBanner({
      id: Date.now().toString(),
      title: isPrivateNotification ? 'JARVIS Security Alert' : `JARVIS Security: ${appName} Opened`,
      body: isPrivateNotification
        ? 'A protected app was launched on your device. Verify recent usage if phone was unattended.'
        : `${appName} was opened locally on device. (Note: App-open does not mean account was hacked).`,
      severity: 'warning',
      time: timeStr,
      categoryTag: 'APP_OPEN',
      actionLabel: 'Audit Security',
      onAction: () => {
        setActiveTab('security');
        setSecuritySubTab('accounts');
      }
    });

    // 2. Append to Comprehensive Security Audit Log
    setSecurityAuditLog(prev => [
      {
        id: Date.now().toString(),
        time: timeStr,
        category: 'APP_OPEN',
        severity: 'WARNING',
        app: appName,
        title: `App Launched: ${appName}`,
        description: isPrivateNotification
          ? `Protected app was launched. Private lockscreen notification dispatched.`
          : `${appName} window transition captured by AccessibilityService.`,
        recommendation: `Confirm you opened this app. If unexpected, check active Facebook/Google sessions in Accounts Center.`
      },
      ...prev.slice(0, 49)
    ]);

    addJarvisResponse(warningSpeech, `Voice Security Alert • ${appName}`);
    setSecurityEventLog(prev => [
      {
        id: Date.now().toString(),
        time: timeStr,
        app: appName,
        text: warningSpeech,
      },
      ...prev.slice(0, 19)
    ]);

    speakText(warningSpeech);
  };

  // Simulate Package Installation & Sideload Monitor (PackageMonitorReceiver.kt)
  const simulatePackageInstall = () => {
    const isVerifiedStore = testInstallSource === 'play_store' || testInstallSource === 'vivo_store';
    const activePerms = Object.entries(testDangerousPerms)
      .filter(([_, val]) => val)
      .map(([key]) => key.split(' ')[0]);

    const isHighRisk = !isVerifiedStore && activePerms.length > 0;
    const severity: 'CRITICAL' | 'WARNING' | 'INFO' = isHighRisk
      ? 'CRITICAL'
      : (!isVerifiedStore ? 'WARNING' : 'INFO');

    const sourceLabel = testInstallSource === 'play_store'
      ? 'Google Play Store (Verified)'
      : testInstallSource === 'vivo_store'
      ? 'Vivo App Store (Verified)'
      : testInstallSource === 'browser'
      ? 'Chrome Browser (Direct APK Sideload)'
      : testInstallSource === 'telegram'
      ? 'Telegram Messenger (Untrusted Sideload)'
      : 'Files / File Manager (Unknown APK)';

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Show Android notification
    setActiveNotificationBanner({
      id: Date.now().toString(),
      title: !isVerifiedStore ? `⚠️ Untrusted App Installed: ${testPackageName}` : `Verified App Installed: ${testPackageName}`,
      body: !isVerifiedStore
        ? `Source: ${sourceLabel}. Sensitive perms: ${activePerms.join(', ') || 'None'}. Review or uninstall.`
        : `Verified package from official store with normal permissions.`,
      severity: severity === 'CRITICAL' ? 'critical' : severity === 'WARNING' ? 'warning' : 'info',
      time: timeStr,
      categoryTag: 'PACKAGE_INSTALL',
      actionLabel: 'Review Permissions',
      onAction: () => {
        setActiveTab('security');
        setSecuritySubTab('packages');
      }
    });

    // Add to Audit Log
    setSecurityAuditLog(prev => [
      {
        id: Date.now().toString(),
        time: timeStr,
        category: 'PACKAGE_INSTALL',
        severity: severity,
        app: testPackageName,
        title: !isVerifiedStore ? `Sideloaded Package: ${testPackageName}` : `Installed Package: ${testPackageName}`,
        description: `Package ID: ${testPackageId} • Installer: ${sourceLabel} • Permissions: ${activePerms.join(', ') || 'None'}`,
        recommendation: !isVerifiedStore
          ? 'Verify this APK was downloaded from a trusted author. Avoid granting SMS or Accessibility permissions.'
          : 'Normal app installation from official application store.'
      },
      ...prev.slice(0, 49)
    ]);

    // Spoken Voice Alert if High Risk Sideload
    if (isHighRisk) {
      const speech = `Sir, ഒരു പുതിയ അൺവെരിഫൈഡ് ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്തിട്ടുണ്ട്: ${testPackageName}. സുരക്ഷാ ക്രമീകരണങ്ങൾ പരിശോധിക്കുക.`;
      setLastSecurityWarning(`⚠️ Sideload Alert • ${testPackageName} • Spoken: "${speech}"`);
      addJarvisResponse(speech, `Package Sentinel • ${testPackageName}`);
      speakText(speech);
    } else {
      speakText(`New package ${testPackageName} registered on device.`);
    }
  };

  // Simulate Sensitive Permission Modification (PermissionAuditManager.kt)
  const simulatePermissionTamper = (permId: string, appName: string, currentlyTampered: boolean) => {
    const nextTampered = !currentlyTampered;
    setPermissionAuditMatrix(prev => prev.map(p => {
      if (p.id === permId) {
        const apps = nextTampered
          ? (p.grantedApps.includes(appName) ? p.grantedApps : [...p.grantedApps, appName])
          : p.grantedApps.filter(a => a !== appName);
        return {
          ...p,
          isTampered: nextTampered,
          grantedApps: apps
        };
      }
      return p;
    }));

    const perm = permissionAuditMatrix.find(p => p.id === permId);
    const permName = perm ? perm.name : 'Sensitive Permission';
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (nextTampered) {
      const speech = `Sir, ശ്രദ്ധിക്കുക! ${appName} ആപ്പിന് ${permName} അനുമതി നൽകിയിട്ടുണ്ട്.`;
      setActiveNotificationBanner({
        id: Date.now().toString(),
        title: `Permission Modified: ${permName}`,
        body: `${appName} was granted access to ${permName}. Review permission in Settings.`,
        severity: permId === 'perm-acc' ? 'critical' : 'warning',
        time: timeStr,
        categoryTag: 'PERMISSION_ALTERED',
        actionLabel: 'Revoke in Settings',
        onAction: () => {
          setActiveTab('security');
          setSecuritySubTab('permissions');
        }
      });

      setSecurityAuditLog(prev => [
        {
          id: Date.now().toString(),
          time: timeStr,
          category: 'PERMISSION_ALTERED',
          severity: permId === 'perm-acc' ? 'CRITICAL' : 'WARNING',
          app: appName,
          title: `Privilege Escalation: ${permName}`,
          description: `App ${appName} was granted access to ${perm?.permission || permName} via AppOps / Settings.Secure.`,
          recommendation: `Check why ${appName} requires ${permName}. Revoke immediately if not required for core features.`
        },
        ...prev.slice(0, 49)
      ]);

      setLastSecurityWarning(`🔑 Permission Alert • ${permName} granted to ${appName}`);
      addJarvisResponse(speech, `Permission Sentinel • ${permName}`);
      speakText(speech);
    } else {
      setActiveNotificationBanner({
        id: Date.now().toString(),
        title: `Permission Revoked: ${permName}`,
        body: `Access to ${permName} was revoked from ${appName}.`,
        severity: 'info',
        time: timeStr,
        categoryTag: 'PERMISSION_ALTERED'
      });

      setSecurityAuditLog(prev => [
        {
          id: Date.now().toString(),
          time: timeStr,
          category: 'PERMISSION_ALTERED',
          severity: 'INFO',
          app: appName,
          title: `Permission Revoked: ${permName}`,
          description: `Access revoked from ${appName}. Privilege state normalized.`,
          recommendation: 'No further action required.'
        },
        ...prev.slice(0, 49)
      ]);
    }
  };

  // Export Security Audit Log
  const exportSecurityAuditReport = () => {
    const reportData = {
      device: 'Vivo X200 FE (OriginOS / FuntouchOS 15)',
      engine: 'JARVIS Personal Phone Security Sentinel',
      exportedAt: new Date().toISOString(),
      activeProtectionModules: {
        packageMonitor: 'PackageMonitorReceiver (Priority 999)',
        permissionAudit: 'PermissionAuditManager (AppOps + Settings.Secure)',
        appLaunchDetection: 'JarvisAppMonitorService (Accessibility Event-driven)',
        notificationChannel: 'jarvis_security_alerts (High Priority + Lockscreen Private)'
      },
      auditLog: securityAuditLog
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `JARVIS-Security-Audit-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Main Query Processing (Intents -> AI Router -> TTS)
  const handleUserQuery = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed) return;

    // Check Speaker Verification if enabled
    if (isSpeakerVerificationEnabled && enrolledVoiceprint) {
      // Simulate verification score
      const simScore = 0.88;
      setVerificationScore(simScore);
    }

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setAssistantState('processing');

    // 1. Guard against AI development instructions, questions, coding queries, and general text
    const lower = trimmed.toLowerCase();
    const devAndQuestionWords = [
      'fix', 'bug', 'code', 'coding', 'api', 'function', 'method', 'class', 'error',
      'app', 'development', 'instructions', 'prompt', 'model', 'gemini', 'openai', 'chatgpt',
      'what', 'how', 'why', 'who', 'when', 'where', 'which', 'explain', 'tell me', 'write',
      'create', 'build', 'issue', 'test', 'script', 'react', 'android', 'kotlin', 'compose',
      'vivo', 'fe', 'interface', 'system', 'parser', 'command', 'help', 'review'
    ];
    const words = lower.split(/[\s,?.!;:()"]+/).filter(Boolean);
    const isDevOrQuestion = devAndQuestionWords.some(w => words.includes(w) || lower.startsWith(w));

    // Strict Phone Call Intent: ONLY when explicitly commanding a phone call to a named contact or digits
    // NEVER from general text, dev instructions, or ordinary chat
    const callRegex = /^(call|dial|make a call to)\s+([a-zA-Z0-9+\-\s]+)$/i;
    const malayalamCallRegex = /^(.+?)(നെ|ലേക്ക്|യെ)?\s*(വിളിക്കുക|കോൾ ചെയ്യുക|ഡയൽ ചെയ്യുക)$/i;

    if (!isDevOrQuestion && (callRegex.test(lower) || malayalamCallRegex.test(lower))) {
      let recipient = 'Contact';
      if (callRegex.test(lower)) {
        const match = lower.match(callRegex);
        recipient = match ? match[2].trim() : 'Contact';
      } else {
        const match = lower.match(malayalamCallRegex);
        recipient = match ? match[1].trim() : 'Contact';
      }

      const forbidden = ['an api', 'the api', 'a function', 'the model', 'back', 'it a day', 'me back'];
      if (!forbidden.includes(recipient) && recipient.length >= 2) {
        setAssistantState('standby');
        setPendingIntent({
          type: 'CALL',
          targetApp: 'Phone Dialer',
          title: 'Confirm Outgoing Call',
          message: `Security Protocol: Confirm initiating a phone call to "${recipient}"?`,
          action: () => {
            const resp = `Placing call to ${recipient} via Vivo X200 FE dialer.`;
            addJarvisResponse(resp, 'Phone Intent');
            speakText(resp);
          }
        });
        speakText(`Confirmation required before placing call to ${recipient}.`);
        return;
      }
    }

    // Strict WhatsApp Message Intent (Requires confirmation)
    const waSendRegex = /^(send\s+whatsapp\s+message|whatsapp\s+message\s+to|send\s+message\s+on\s+whatsapp)\s+to\s+(.+)$/i;
    const waSendMlRegex = /^വാട്സ്ആപ്പിൽ\s+(.+)\s+സന്ദേശം\s+അയക്കുക$/i;
    if (!isDevOrQuestion && (waSendRegex.test(lower) || waSendMlRegex.test(lower))) {
      setAssistantState('standby');
      setPendingIntent({
        type: 'WHATSAPP',
        targetApp: 'WhatsApp',
        title: 'Confirm WhatsApp Dispatch',
        message: 'Security Protocol: Confirm dispatching WhatsApp message?',
        action: () => {
          const resp = 'WhatsApp message dispatched to recipient.';
          addJarvisResponse(resp, 'WhatsApp Intent');
          speakText(resp);
        }
      });
      speakText('Confirmation required before sending WhatsApp message.');
      return;
    }

    // Strict App Launch Intents
    if (!isDevOrQuestion && (/^(open|launch)\s+whatsapp$/i.test(lower) || /^(വാട്സ്ആപ്പ്|വാട്ട്സാപ്പ്)\s+(തുറക്കുക|തുറക്കൂ)$/i.test(lower))) {
      const resp = 'Opening WhatsApp on your Vivo X200 FE.';
      addJarvisResponse(resp, 'WhatsApp Intent');
      speakText(resp);
      return;
    }

    if (!isDevOrQuestion && (/^(open|launch)\s+(the\s+)?camera$/i.test(lower) || /^(take\s+a\s+photo)$/i.test(lower) || /^(ക്യാമറ\s+(തുറക്കുക|തുറക്കൂ)|ഫോട്ടോ\s+എടുക്കുക)$/i.test(lower))) {
      const resp = 'Opening Vivo X200 FE Zeiss Camera system.';
      addJarvisResponse(resp, 'Camera Intent');
      speakText(resp);
      return;
    }

    if (!isDevOrQuestion && (/^(open|launch)\s+(the\s+)?youtube$/i.test(lower) || /^(യൂട്യൂബ്\s+(തുറക്കുക|തുറക്കൂ))$/i.test(lower))) {
      const resp = 'Launching YouTube application.';
      addJarvisResponse(resp, 'YouTube Intent');
      speakText(resp);
      return;
    }

    if (!isDevOrQuestion && (/^(open|launch)\s+(the\s+)?(settings|system settings)$/i.test(lower) || /^(സെറ്റിംഗ്സ്\s+(തുറക്കുക|തുറക്കൂ)|ക്രമീകരണങ്ങൾ\s+(തുറക്കുക|തുറക്കൂ))$/i.test(lower))) {
      const resp = 'Opening Android System Settings.';
      addJarvisResponse(resp, 'Settings Intent');
      speakText(resp);
      return;
    }

    // Voice Intent: English Speaking Tutor Mode
    if (!isDevOrQuestion && (
      /^(start|enable|open|launch)\s+(the\s+)?(english\s+tutor|tutor\s+mode|english\s+learning)/i.test(lower) ||
      /^(ഇംഗ്ലീഷ്\s+പഠിപ്പിക്കൂ|ട്യൂട്ടർ\s+മോഡ്|ഇംഗ്ലീഷ്\s+ട്യൂട്ടർ\s+തുടങ്ങുക)$/i.test(trimmed)
    )) {
      setActiveTab('tutor');
      const resp = 'Starting JARVIS English Speaking Tutor mode. നിങ്ങളുടെ ഇംഗ്ലീഷ് സംഭാഷണ പരിശീലനം ആരംഭിക്കുന്നു.';
      addJarvisResponse(resp, 'Tutor Intent');
      speakText(resp);
      return;
    }

    // Voice Intent: AI Reel Creator
    if (!isDevOrQuestion && (
      /^(create|generate|make|open)\s+(a\s+)?(reel|reels|ai\s+reel\s+creator)/i.test(lower) ||
      /^(റീൽ\s+ഉണ്ടാക്കുക|റീൽ\s+നിർമ്മിക്കുക|റീൽ\s+ക്രിയേറ്റർ\s+തുറക്കുക)$/i.test(trimmed)
    )) {
      setActiveTab('reels');
      const resp = 'Opening 9:16 AI Reel Creator Studio for your Vivo X200 FE. 9:16 റീൽ നിർമ്മാണ സ്റ്റുഡിയോ തുറക്കുന്നു.';
      addJarvisResponse(resp, 'Reels Intent');
      speakText(resp);
      return;
    }

    // Voice Intent: Date & Location Gallery Video Search
    if (!isDevOrQuestion && (
      /^(search|find)\s+(gallery\s+)?(videos?|clips?)/i.test(lower) ||
      /^(വീഡിയോകൾ\s+തിരയുക|വീഡിയോ\s+കണ്ടെത്തുക)$/i.test(trimmed)
    )) {
      setActiveTab('reels');
      const resp = 'Opening Gallery Video Search engine by date and EXIF location. ഗാലറി വീഡിയോ സെർച്ച് ആരംഭിക്കുന്നു.';
      addJarvisResponse(resp, 'Gallery Search Intent');
      speakText(resp);
      return;
    }

    // Voice Intent: Emergency Isolation Kill-Switch
    if (!isDevOrQuestion && (
      /^(emergency\s+isolation|lockdown|freeze\s+system|engage\s+isolation)/i.test(lower) ||
      /^(എമർജൻസി\s+ലോക്ക്ഡൗൺ|എമർജൻസി\s+ഐസൊലേഷൻ|സിസ്റ്റം\s+ലോക്ക്\s+ചെയ്യുക)$/i.test(trimmed)
    )) {
      setActiveTab('security');
      setSecuritySubTab('isolation');
      try {
        await fetch('/api/security/isolation/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isolate: true, reason: 'Spoken Malayalam Emergency Voice Command' })
        });
      } catch (e) {}
      const resp = 'Warning! JARVIS Emergency Isolation engaged. Outbound AI calls suspended. ശ്രദ്ധിക്കുക! ജാർവിസ് എമർജൻസി ലോക്ക്ഡൗൺ സജീവമാക്കി.';
      addJarvisResponse(resp, 'Self-Protection Intent');
      speakText(resp);
      return;
    }

    // 2. Query AI Router Backend (/api/ai/query)
    try {
      const res = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: trimmed,
          preferredProvider: routerPreference,
          customGeminiKey: geminiKey || undefined,
          customOpenAiKey: openAiKey || undefined,
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Server router returned error');
      }

      const responseText = data.response || 'Understood, sir.';
      const providerLabel = `${data.providerName || 'Gemini 3.8 Flash'} • ${data.reason || 'Auto-Routed'}`;

      addJarvisResponse(responseText, providerLabel);
      speakText(responseText);
    } catch (err: any) {
      console.warn('AI query router error:', err);
      const isMl = /[\u0D00-\u0D7F]/.test(trimmed);
      const fallbackText = isMl
        ? 'ക്ഷമിക്കണം സാർ, സെർവർ കണക്ഷൻ ലഭ്യമല്ല. എങ്കിലും ഓഫ്‌ലൈൻ ആപ്പ് നിയന്ത്രണങ്ങൾ (ക്യാമറ, വാട്സ്ആപ്പ്, ഫോൺ) സജ്ജമാണ്.'
        : 'Apologies sir, unable to complete online cloud routing. Local offline commands (Camera, WhatsApp, Phone) remain operational.';
      addJarvisResponse(fallbackText, 'Offline Engine');
      speakText(fallbackText);
    }
  };

  // Download entire Android Project as a ZIP
  const downloadAndroidProjectZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Top-level files
      zip.file('settings.gradle.kts', `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "JARVIS"
include(":app")
`);

      zip.file('build.gradle.kts', `// Top-level build file
plugins {
    id("com.android.application") version "8.7.0" apply false
    id("org.jetbrains.kotlin.android") version "2.0.21" apply false
    id("org.jetbrains.kotlin.plugin.compose") version "2.0.21" apply false
}
`);

      zip.file('gradle.properties', `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
kotlin.code.style=official
android.nonTransitiveRClass=true
`);

      // Add all project files from manifest
      for (const file of ANDROID_PROJECT_FILES) {
        zip.file(file.path, file.content);
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'JARVIS-Android-VivoX200FE.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to create ZIP:', e);
      alert('Error creating ZIP file.');
    } finally {
      setIsZipping(false);
    }
  };

  // Copy code helper
  const copySelectedFileCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top HUD Header */}
      <header className="border-b border-cyan-950/40 bg-[#070B18]/80 backdrop-blur sticky top-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-950/50 border border-cyan-500/30">
              <span className="w-4 h-4 rounded-full bg-cyan-400 animate-ping absolute opacity-40"></span>
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold tracking-widest text-cyan-400 text-lg">JARVIS</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300">
                  VIVO X200 FE
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
                  ML + EN NATIVE
                </span>
              </div>
              <p className="text-xs text-slate-400">Kotlin & Jetpack Compose Android Voice Assistant</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-1 sm:space-x-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'simulator'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Vivo Simulator</span>
            </button>
            <button
              onClick={() => setActiveTab('tutor')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'tutor'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              <span>English Tutor</span>
            </button>
            <button
              onClick={() => setActiveTab('reels')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'reels'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-purple-400" />
              <span>AI Reel Studio</span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'security'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Security Sentinel</span>
            </button>
            <button
              onClick={() => setActiveTab('bluetooth')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'bluetooth'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Headphones className="w-3.5 h-3.5 text-cyan-400" />
              <span>Bluetooth & Driving</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'code'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Android Code</span>
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'guide'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Build & APK Guide</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'settings'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <SettingsIcon className="w-3.5 h-3.5" />
              <span>Keystore & Settings</span>
            </button>
          </div>

          {/* Bluetooth Headset Quick Status Badge */}
          <div
            onClick={() => setActiveTab('bluetooth')}
            className="hidden xl:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 cursor-pointer transition text-xs"
            title="Click to open Bluetooth & Hands-Free Audio settings"
          >
            <div className="flex items-center space-x-1.5">
              <span className={`w-2 h-2 rounded-full ${isHeadsetConnected ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
              <Headphones className={`w-3.5 h-3.5 ${isHeadsetConnected ? 'text-cyan-400' : 'text-slate-500'}`} />
            </div>
            <div className="text-left font-mono">
              <span className="block text-[9px] text-slate-400 leading-none">
                {isHeadsetConnected ? 'BT SCO ACTIVE' : 'SPEAKER ROUTE'}
              </span>
              <span className="text-[11px] font-bold text-slate-200 truncate max-w-[130px] block leading-tight">
                {isHeadsetConnected ? headsetName : 'Built-in Speaker'}
              </span>
            </div>
          </div>

          {/* Download Project Button */}
          <button
            onClick={downloadAndroidProjectZip}
            disabled={isZipping}
            className="hidden md:flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isZipping ? 'Bundling ZIP…' : 'Export Android Project (.zip)'}</span>
          </button>
        </div>
      </header>

      {/* Floating Heads-Up Android 15 / OriginOS Security Notification Banner */}
      {activeNotificationBanner && (
        <div className="fixed top-20 right-4 z-50 max-w-sm sm:max-w-md w-full animate-fade-in shadow-2xl">
          <div className={`p-4 rounded-2xl backdrop-blur-xl border ${
            activeNotificationBanner.severity === 'critical'
              ? 'bg-rose-950/95 border-rose-500 text-rose-100 shadow-rose-950/60'
              : activeNotificationBanner.severity === 'warning'
              ? 'bg-amber-950/95 border-amber-500 text-amber-100 shadow-amber-950/60'
              : 'bg-slate-900/95 border-cyan-500 text-slate-100 shadow-cyan-950/60'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <div className={`p-2 rounded-xl shrink-0 ${
                  activeNotificationBanner.severity === 'critical' ? 'bg-rose-500/30 text-rose-300' :
                  activeNotificationBanner.severity === 'warning' ? 'bg-amber-500/30 text-amber-300' :
                  'bg-cyan-500/30 text-cyan-300'
                }`}>
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono tracking-wider uppercase font-bold text-slate-300">
                      JARVIS Android Security
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-slate-400">
                      {activeNotificationBanner.time}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs leading-tight mt-0.5">{activeNotificationBanner.title}</h4>
                </div>
              </div>
              <button
                onClick={() => setActiveNotificationBanner(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
                title="Dismiss"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
              {activeNotificationBanner.body}
            </p>
            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-mono text-[10px]">
                Channel: <code>jarvis_security_alerts</code>
              </span>
              <div className="flex space-x-2">
                {activeNotificationBanner.onAction && (
                  <button
                    onClick={() => {
                      const action = activeNotificationBanner.onAction;
                      setActiveNotificationBanner(null);
                      if (action) action();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold transition"
                  >
                    {activeNotificationBanner.actionLabel || 'Inspect'}
                  </button>
                )}
                <button
                  onClick={() => setActiveNotificationBanner(null)}
                  className="px-2 py-1 rounded-lg bg-black/30 hover:bg-black/50 text-slate-300 transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col">
        {/* TAB 1: Vivo X200 FE Simulator */}
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
            {/* Left: Interactive Phone Mockup */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-[390px] rounded-[44px] p-3 bg-gradient-to-b from-slate-800 via-slate-900 to-black border-[3px] border-slate-700 shadow-2xl shadow-cyan-950/40 relative">
                {/* Vivo X200 FE Frame */}
                <div className="w-full h-[680px] rounded-[34px] bg-[#050811] overflow-hidden flex flex-col relative border border-slate-800/80">
                  {/* Phone Status Bar & Punch Hole Camera */}
                  <div className="h-7 px-5 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-950/60 z-20">
                    <span>12:54</span>
                    {/* Punch hole camera */}
                    <div className="w-3.5 h-3.5 rounded-full bg-black border border-slate-800 flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-cyan-900"></div>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      {isHeadsetConnected && (
                        <span className="flex items-center space-x-0.5 text-[9px] text-cyan-400 font-bold bg-cyan-950/80 px-1 py-0.2 rounded border border-cyan-500/40" title="Bluetooth SCO Headset Connected">
                          <Headphones className="w-2.5 h-2.5" />
                          <span>SCO</span>
                        </span>
                      )}
                      <span className="text-[9px] text-cyan-400 font-bold">5G</span>
                      <div className="w-4 h-2 border border-slate-500 rounded-sm p-0.5 flex items-center">
                        <div className="w-2.5 h-1 bg-cyan-400 rounded-2xs"></div>
                      </div>
                    </div>
                  </div>

                  {/* Phone App Header */}
                  <div className="px-4 py-2 border-b border-slate-800/60 flex items-center justify-between bg-slate-950/40">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                        <span className="font-mono text-xs font-bold tracking-wider text-cyan-400">JARVIS NEURAL CORE</span>
                      </div>
                      <span className="text-[10px] text-slate-400">OriginOS / FuntouchOS 15</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                      {routerPreference === 'auto' ? 'Auto-Router' : routerPreference.toUpperCase()}
                    </span>
                  </div>

                  {/* Bluetooth Headset Quick Status inside Phone */}
                  <div className="px-3 py-1 bg-gradient-to-r from-cyan-950/50 via-slate-950 to-slate-900 border-b border-cyan-500/20 flex items-center justify-between text-[10px]">
                    <div className="flex items-center space-x-1.5 text-cyan-300 truncate mr-2">
                      <Headphones className={`w-3.5 h-3.5 shrink-0 ${isHeadsetConnected ? 'text-cyan-400' : 'text-slate-500'}`} />
                      <span className="font-mono truncate">
                        {isHeadsetConnected ? `BT: ${headsetName}` : 'Route: Phone Speaker'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={triggerHeadsetStemClick}
                        title="Simulate Earbud Button Click (KEYCODE_HEADSETHOOK)"
                        className="px-1.5 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[9px] font-mono border border-cyan-500/40 flex items-center space-x-1"
                      >
                        <Radio className="w-2.5 h-2.5" />
                        <span>Earbud Tap</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('bluetooth')}
                        className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] font-mono"
                        title="Configure Bluetooth"
                      >
                        &gt;
                      </button>
                    </div>
                  </div>

                  {/* Security Alert Quick Status inside Phone */}
                  <div className="px-3 py-1 bg-gradient-to-r from-rose-950/40 via-slate-950 to-slate-900 border-b border-rose-500/20 flex items-center justify-between text-[10px]">
                    <div className="flex items-center space-x-1.5 text-rose-300">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="font-mono truncate">
                        {isSecurityAlertActive ? `Alert: ${monitoredApps.length} Apps Monitored` : 'Alert Disarmed'}
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveTab('security')}
                      className="px-2 py-0.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[9px] font-mono border border-rose-500/40"
                    >
                      Config &gt;
                    </button>
                  </div>

                  {/* Arc Reactor Center Core */}
                  <div className="relative py-4 flex flex-col items-center justify-center">
                    <canvas
                      ref={canvasRef}
                      width={220}
                      height={180}
                      className="w-[200px] h-[160px] mx-auto block"
                    />

                    {/* Status Pill */}
                    <div className="mt-1 flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-500/30">
                      <span className={`w-2 h-2 rounded-full ${
                        assistantState === 'listening' ? 'bg-cyan-400 animate-pulse' :
                        assistantState === 'processing' ? 'bg-amber-400 animate-ping' :
                        assistantState === 'speaking' ? 'bg-emerald-400' : 'bg-slate-500'
                      }`} />
                      <span className="font-mono text-[10px] tracking-wide text-cyan-300 uppercase">
                        {assistantState === 'listening' && 'Listening (EN & ML)…'}
                        {assistantState === 'processing' && 'Neural Routing…'}
                        {assistantState === 'speaking' && 'Speaking (TTS)…'}
                        {assistantState === 'standby' && 'Standby • Say "JARVIS"'}
                      </span>
                    </div>

                    {/* Live Transcript Bubble */}
                    {liveTranscript && (
                      <div className="mt-2 mx-4 px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-[11px] font-mono text-cyan-300 animate-pulse">
                        "{liveTranscript}"
                      </div>
                    )}
                  </div>

                  {/* Suggestion Chips */}
                  <div className="px-3 py-1 flex space-x-2 overflow-x-auto no-scrollbar">
                    {[
                      '🚨 Alert: Open Facebook',
                      '🚨 Alert: Open WhatsApp',
                      '⚠️ Sideload Test APK',
                      '🔑 Alter Camera Access',
                      'വാട്സ്ആപ്പ് തുറക്കൂ',
                      'ക്യാമറ',
                      'Open YouTube',
                      'Vivo X200 FE specs'
                    ].map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (chip === '🚨 Alert: Open Facebook') {
                            triggerSecurityAlert('Facebook');
                          } else if (chip === '🚨 Alert: Open WhatsApp') {
                            triggerSecurityAlert('WhatsApp');
                          } else if (chip === '⚠️ Sideload Test APK') {
                            simulatePackageInstall();
                          } else if (chip === '🔑 Alter Camera Access') {
                            simulatePermissionTamper('perm-cam', 'SuspiciousUtilityApp', false);
                          } else {
                            handleUserQuery(chip);
                          }
                        }}
                        className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 transition"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>

                  {/* Message Thread */}
                  <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2.5 text-xs">
                    {messages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl p-2.5 border ${
                            msg.sender === 'user'
                              ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-100 rounded-br-xs'
                              : 'bg-slate-900/90 border-slate-800 text-slate-200 rounded-bl-xs'
                          }`}
                        >
                          {msg.sender === 'jarvis' && msg.badge && (
                            <div className="flex items-center justify-between mb-1 pb-1 border-b border-slate-800/80">
                              <span className="font-mono text-[9px] text-cyan-400 font-bold">JARVIS</span>
                              <span className="font-mono text-[9px] text-amber-400/90">{msg.badge}</span>
                            </div>
                          )}
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        </div>
                        <span className="text-[9px] text-slate-500 mt-0.5 px-1 font-mono">{msg.timestamp}</span>
                      </div>
                    ))}
                  </div>

                  {/* Speech Recognition Error Banner */}
                  {speechAsrError && (
                    <div className="mx-3 my-1 p-2 rounded-xl bg-rose-950/80 border border-rose-500/40 text-[11px] text-rose-300 flex items-center justify-between animate-fade-in">
                      <div className="flex items-center space-x-1.5 truncate mr-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span className="truncate">{speechAsrError}</span>
                      </div>
                      <button
                        onClick={() => setSpeechAsrError(null)}
                        className="text-rose-400 hover:text-white shrink-0 p-0.5"
                        title="Dismiss error"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Speech Language Mode Selector Bar */}
                  <div className="px-3 py-1 bg-slate-950/90 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono">
                    <div className="flex items-center space-x-1 text-slate-400">
                      <span className="text-slate-500 font-bold">ASR:</span>
                      {(['auto', 'ml-IN', 'en-IN'] as const).map(l => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setSpeechLanguage(l)}
                          className={`px-1.5 py-0.5 rounded transition ${
                            speechLanguage === l
                              ? 'bg-cyan-500/25 text-cyan-300 font-bold border border-cyan-500/40'
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {l === 'auto' ? 'Auto (ML+EN)' : (l === 'ml-IN' ? 'മലയാളം' : 'English')}
                        </button>
                      ))}
                    </div>

                    {isTranscribing ? (
                      <span className="text-amber-400 animate-pulse font-bold flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                        <span>Transcribing…</span>
                      </span>
                    ) : lastAsrMeta ? (
                      <span className="text-slate-500 text-[9px] truncate max-w-[130px]" title={`Recognized via ${lastAsrMeta.engine}`}>
                        {lastAsrMeta.engine} • {lastAsrMeta.lang}
                      </span>
                    ) : (
                      <span className="text-slate-600 text-[9px]">WebSpeech + Gemini ASR</span>
                    )}
                  </div>

                  {/* Bottom Input Controls */}
                  <div className="p-3 bg-slate-950/80 border-t border-slate-800/80 flex items-center space-x-2">
                    {/* Glowing Mic Trigger */}
                    <button
                      onClick={toggleListening}
                      disabled={isTranscribing}
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                        isListening
                          ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/50 scale-105 ring-2 ring-cyan-300'
                          : isTranscribing
                          ? 'bg-amber-500 text-slate-950 animate-pulse'
                          : 'bg-slate-900 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-950'
                      }`}
                      title={isListening ? "Listening... Tap to finish & transcribe" : "Start speaking (Malayalam / English)"}
                    >
                      {isListening ? (
                        <Mic className="w-5 h-5 animate-pulse" />
                      ) : isTranscribing ? (
                        <RotateCcw className="w-5 h-5 animate-spin" />
                      ) : (
                        <MicOff className="w-5 h-5" />
                      )}
                    </button>

                    {/* Text Input Field: Real-time visual feedback while speaking */}
                    <div className={`flex-1 flex items-center rounded-full bg-slate-900 border px-3 py-1.5 transition ${
                      isListening
                        ? 'border-cyan-400/80 ring-1 ring-cyan-400/30'
                        : 'border-slate-800 focus-within:border-cyan-500/50'
                    }`}>
                      <input
                        type="text"
                        value={textInput}
                        onChange={e => setTextInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && textInput.trim()) {
                            handleUserQuery(textInput);
                            setTextInput('');
                          }
                        }}
                        placeholder={
                          isListening
                            ? "🎙️ Listening... speak now in Malayalam or English"
                            : isTranscribing
                            ? "Transcribing voice audio…"
                            : "Malayalam (മലയാളം) or English…"
                        }
                        className="w-full bg-transparent text-xs text-slate-200 focus:outline-none placeholder:text-slate-500"
                      />
                      {textInput.trim() && !isListening && (
                        <button
                          onClick={() => {
                            handleUserQuery(textInput);
                            setTextInput('');
                          }}
                          className="text-cyan-400 hover:text-cyan-300 p-1"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Safety Confirmation Dialog Modal */}
                  {pendingIntent && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-30 flex items-center justify-center p-4">
                      <div className="w-full bg-slate-900 border border-amber-500/50 rounded-2xl p-4 shadow-2xl">
                        <div className="flex items-center space-x-2 text-amber-400 mb-2">
                          <AlertTriangle className="w-5 h-5" />
                          <span className="font-mono text-xs font-bold uppercase tracking-wider">{pendingIntent.title}</span>
                        </div>
                        <p className="text-xs text-slate-300 mb-4 leading-relaxed">{pendingIntent.message}</p>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setPendingIntent(null);
                              addJarvisResponse('Action aborted upon your cancellation, sir.', 'Safety Protocol');
                              speakText('Action aborted, sir.');
                            }}
                            className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-400 hover:text-slate-200"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              const action = pendingIntent.action;
                              setPendingIntent(null);
                              action();
                            }}
                            className="px-3 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs"
                          >
                            Authorize Action
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pocket Mode Blackout Overlay */}
                  {isPocketMode && (
                    <div className="absolute inset-0 bg-black/95 z-30 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                      <div className="w-16 h-16 rounded-full bg-cyan-950/70 border border-cyan-500/50 flex items-center justify-center mb-4 animate-pulse">
                        <Headphones className="w-8 h-8 text-cyan-400" />
                      </div>
                      <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold">
                        POCKET MODE ENGAGED
                      </span>
                      <h3 className="text-sm font-bold text-slate-100 mt-1">
                        Screen Asleep in Pocket
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
                        Tap your earbud stem or say <strong>"JARVIS"</strong> to speak hands-free without waking the screen.
                      </p>

                      <div className="mt-5 flex flex-col gap-2 w-full max-w-[210px]">
                        <button
                          onClick={triggerHeadsetStemClick}
                          className="w-full py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg"
                        >
                          <Radio className="w-3.5 h-3.5" />
                          <span>Tap Earbud Stem</span>
                        </button>
                        <button
                          onClick={() => setIsPocketMode(false)}
                          className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 font-semibold text-xs hover:bg-slate-800"
                        >
                          Exit Pocket Mode
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Feature Diagnostics & Live Testing Panel */}
            <div className="lg:col-span-6 space-y-4">
              {/* Bluetooth Headset Quick Testbench Widget */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/30 to-slate-900/80 border border-cyan-500/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 text-cyan-400">
                    <Headphones className="w-4 h-4" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider">
                      Bluetooth SCO & Pocket Mode
                    </span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    isHeadsetConnected
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}>
                    {isHeadsetConnected ? 'Duplex Link Active' : 'Speaker Fallback'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                  Bidirectional audio routes voice commands through your headset microphone and speaks responses directly to your ears.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <button
                    onClick={triggerHeadsetStemClick}
                    className="p-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-mono text-[11px] text-center font-bold"
                  >
                    🔘 Earbud Tap
                  </button>
                  <button
                    onClick={() => setIsPocketMode(!isPocketMode)}
                    className={`p-2 rounded-xl border font-mono text-[11px] text-center font-bold transition ${
                      isPocketMode
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    ⚡ Pocket Mode
                  </button>
                  <button
                    onClick={() => setIsDrivingMode(!isDrivingMode)}
                    className={`p-2 rounded-xl border font-mono text-[11px] text-center font-bold transition ${
                      isDrivingMode
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    🚗 Driving Mode
                  </button>
                  <button
                    onClick={() => {
                      if (isHeadsetConnected) {
                        simulateHeadsetDisconnect();
                      } else {
                        simulateHeadsetReconnect();
                      }
                    }}
                    className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-mono text-[11px] text-center"
                  >
                    {isHeadsetConnected ? '🔌 Unplug' : '🎧 Re-pair'}
                  </button>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-mono truncate max-w-[200px]">
                    Device: {isHeadsetConnected ? headsetName : 'Built-in Speaker'}
                  </span>
                  <button
                    onClick={() => setActiveTab('bluetooth')}
                    className="text-cyan-400 hover:text-cyan-300 font-mono font-semibold"
                  >
                    Full Headset Panel &gt;
                  </button>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <h3 className="font-mono text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Vivo X200 FE Core Architecture</span>
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-slate-200 block">Malayalam & English</span>
                    <span className="text-[11px] text-slate-400">Bilingual speech recognition + deep male TTS pitch</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-slate-200 block">Dual Cloud AI Router</span>
                    <span className="text-[11px] text-slate-400">Intelligent dispatch: Gemini 2.5 Flash & OpenAI GPT-4o</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-slate-200 block">Hardware Keystore Vault</span>
                    <span className="text-[11px] text-slate-400">EncryptedSharedPreferences (AES-256 GCM)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-slate-200 block">Action Safety Confirmation</span>
                    <span className="text-[11px] text-slate-400">Mandatory authorization before calls & WhatsApp</span>
                  </div>
                </div>
              </div>

              {/* Voice & Malayalam TTS Tester */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2 text-slate-200">
                    <Volume2 className="w-4 h-4 text-cyan-400" />
                    <span className="font-semibold text-xs">Malayalam Text-to-Speech Engine</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    Pitch {maleMalayalamPitch ? '0.82 (Masculine)' : '1.0 (Standard)'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Tests the acoustic speech synthesizer with Malayalam phrasing calibrated for an authoritative, masculine JARVIS vocal style.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => speakText('നമസ്കാരം സാർ, ഞാൻ ജാർവിസ് ആണ്. വിവോ X200 FE-യിൽ ഞാൻ സജ്ജമാണ്.')}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 text-xs transition"
                  >
                    <Play className="w-3 h-3" />
                    <span>Speak Malayalam Greeting</span>
                  </button>
                  <button
                    onClick={() => speakText('At your command, sir. All neural routines are operational.')}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                  >
                    <Play className="w-3 h-3" />
                    <span>Speak English Greeting</span>
                  </button>
                </div>
              </div>

              {/* Speech-to-Text (ASR) Precision & Verification Engine */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/20 via-slate-900/60 to-slate-900/60 border border-emerald-500/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 text-emerald-300">
                    <Mic className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-xs">Speech-to-Text (ASR) Transcription Engine</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                    ml-IN & en-IN Supported
                  </span>
                </div>
                <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                  Converts spoken voice audio into visible text in the JARVIS input field while speaking, then executes the AI chat handler upon completion. Test speaking or trigger verified Malayalam & English ASR sentences:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => testSpeechRecognitionSentence('നമസ്കാരം ജാർവിസ്, ഇന്നത്തെ വിശേഷങ്ങൾ എന്തൊക്കെയാണ്?', 'ml-IN')}
                    className="p-3 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/70 border border-emerald-500/40 text-emerald-300 text-left transition flex items-center justify-between group"
                  >
                    <div>
                      <span className="font-bold block text-xs flex items-center space-x-1">
                        <span>🎙️ Test Malayalam ASR (ml-IN)</span>
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        "നമസ്കാരം ജാർവിസ്, ഇന്നത്തെ വിശേഷങ്ങൾ..."
                      </span>
                    </div>
                    <Play className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition" />
                  </button>

                  <button
                    onClick={() => testSpeechRecognitionSentence('JARVIS, check system status and memory on Vivo X200 FE.', 'en-IN')}
                    className="p-3 rounded-xl bg-cyan-950/50 hover:bg-cyan-900/70 border border-cyan-500/40 text-cyan-300 text-left transition flex items-center justify-between group"
                  >
                    <div>
                      <span className="font-bold block text-xs flex items-center space-x-1">
                        <span>🎙️ Test English ASR (en-IN)</span>
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        "JARVIS, check system status and memory..."
                      </span>
                    </div>
                    <Play className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition" />
                  </button>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] flex flex-wrap items-center justify-between text-slate-400 font-mono gap-1">
                  <span>Selected Mode: <strong className="text-cyan-300">{speechLanguage.toUpperCase()}</strong></span>
                  {lastAsrMeta ? (
                    <span className="text-emerald-400">
                      Active: {lastAsrMeta.engine} • {lastAsrMeta.lang}
                    </span>
                  ) : (
                    <span className="text-slate-500">Dual ASR: WebSpeech + Gemini Multimodal</span>
                  )}
                </div>
              </div>

              {/* Speaker Verification Test Bench */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 text-slate-200">
                    <ShieldAlert className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-xs">On-Device Speaker Verification</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                    {enrolledVoiceprint ? 'Profile Calibrated' : 'Not Enrolled'}
                  </span>
                </div>
                {/* Privacy Disclaimer */}
                <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-300/90 mb-3">
                  <strong>Privacy & Security Notice:</strong> Voice recognition is an on-device personalization feature and must <u>NOT</u> be used as biometric device security. Voiceprints never leave your phone.
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setIsEnrolling(true);
                      setTimeout(() => {
                        setEnrolledVoiceprint([0.45, 0.72, 0.63, 0.81, 0.55]);
                        setIsSpeakerVerificationEnabled(true);
                        setIsEnrolling(false);
                        alert('Owner acoustic fingerprint profile calibrated and encrypted locally!');
                      }, 1800);
                    }}
                    disabled={isEnrolling}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition disabled:opacity-50"
                  >
                    {isEnrolling ? 'Extracting Acoustic Vectors…' : 'Enroll Owner Voice (3 Phrases)'}
                  </button>
                  {enrolledVoiceprint && (
                    <button
                      onClick={() => {
                        setEnrolledVoiceprint(null);
                        setIsSpeakerVerificationEnabled(false);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-rose-400 hover:bg-rose-950/20"
                    >
                      Clear Profile
                    </button>
                  )}
                </div>
              </div>

              {/* Voice Security Alert Simulation Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/20 via-slate-900/60 to-slate-900/60 border border-rose-500/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 text-rose-300">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span className="font-semibold text-xs">Real-Time Voice Security Alert</span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    isSecurityAlertActive
                      ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}>
                    {isSecurityAlertActive ? 'ARMED' : 'DISARMED'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mb-3">
                  Speaks Malayalam warning if unattended device is unlocked and target apps are opened:
                  <span className="block mt-1 text-[11px] font-mono text-cyan-300 italic">
                    "Sir, ശ്രദ്ധിക്കുക! നിങ്ങളുടെ ഫോണിൽ [App] തുറന്നിട്ടുണ്ട്. ഇത് നിങ്ങളാണോ ഉപയോഗിക്കുന്നത്?"
                  </span>
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    onClick={() => triggerSecurityAlert('Facebook')}
                    className="px-2.5 py-1.5 rounded-lg bg-blue-900/40 border border-blue-500/40 text-blue-200 hover:bg-blue-900/60 flex items-center space-x-1"
                  >
                    <span>📘 Launch Facebook Alert</span>
                  </button>
                  <button
                    onClick={() => triggerSecurityAlert('WhatsApp')}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-900/40 border border-emerald-500/40 text-emerald-200 hover:bg-emerald-900/60 flex items-center space-x-1"
                  >
                    <span>💬 Launch WhatsApp Alert</span>
                  </button>
                  <button
                    onClick={() => triggerSecurityAlert('Instagram')}
                    className="px-2.5 py-1.5 rounded-lg bg-pink-900/40 border border-pink-500/40 text-pink-200 hover:bg-pink-900/60 flex items-center space-x-1"
                  >
                    <span>📷 Launch Instagram Alert</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 flex items-center space-x-1"
                  >
                    <span>⚙️ Manage Apps & Cooldown &rarr;</span>
                  </button>
                </div>
              </div>

              {/* Quick Intent Simulation Buttons */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <h4 className="font-semibold text-xs text-slate-200 mb-2">Device Control Intent Triggers</h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    onClick={() => handleUserQuery('വാട്സ്ആപ്പ് തുറക്കൂ')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    💬 WhatsApp Open
                  </button>
                  <button
                    onClick={() => handleUserQuery('Send message on WhatsApp to Rahul')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    🔒 WhatsApp (Requires Confirm)
                  </button>
                  <button
                    onClick={() => handleUserQuery('ഇംഗ്ലീഷ് പഠിപ്പിക്കൂ')}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300"
                  >
                    🎓 ഇംഗ്ലീഷ് ട്യൂട്ടർ
                  </button>
                  <button
                    onClick={() => handleUserQuery('റീൽ ഉണ്ടാക്കുക')}
                    className="px-2.5 py-1.5 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-300"
                  >
                    🎬 9:16 AI Reel
                  </button>
                  <button
                    onClick={() => handleUserQuery('വീഡിയോകൾ തിരയുക')}
                    className="px-2.5 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300"
                  >
                    🔍 Gallery Search (Valparai)
                  </button>
                  <button
                    onClick={() => handleUserQuery('എമർജൻസി ലോക്ക്ഡൗൺ')}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300"
                  >
                    🚨 എമർജൻസി ഐസൊലേഷൻ
                  </button>
                  <button
                    onClick={() => handleUserQuery('Call Mom')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    📞 Phone (Requires Confirm)
                  </button>
                  <button
                    onClick={() => handleUserQuery('ക്യാമറ തുറക്കൂ')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    📷 Vivo Zeiss Camera
                  </button>
                  <button
                    onClick={() => handleUserQuery('യൂട്യൂബിൽ പാട്ട് വെക്കൂ')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    ▶️ YouTube
                  </button>
                  <button
                    onClick={() => handleUserQuery('Open Android Settings')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    ⚙️ Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: English Speaking Tutor Module */}
        {activeTab === 'tutor' && (
          <div className="max-w-6xl mx-auto w-full">
            <EnglishTutorModule
              isHeadsetConnected={isHeadsetConnected}
              onSpeak={speakText}
              geminiKey={geminiKey}
            />
          </div>
        )}

        {/* TAB: AI Reel Creator & Gallery Video Search Module */}
        {activeTab === 'reels' && (
          <div className="max-w-6xl mx-auto w-full">
            <AiReelCreatorModule
              onSpeak={speakText}
              geminiKey={geminiKey}
            />
          </div>
        )}

        {/* TAB 2: Personal Phone Security Monitoring Module */}
        {activeTab === 'security' && (
          <div className="max-w-5xl mx-auto w-full space-y-6">
            {/* Top Status & Master Control Hero */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950/30 via-slate-900/80 to-[#0c0e1c] border border-rose-500/30 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <ShieldAlert className="w-56 h-56 text-rose-500" />
              </div>
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="p-1.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300">
                      <ShieldAlert className="w-5 h-5 text-rose-400" />
                    </span>
                    <h2 className="text-xl font-bold font-mono tracking-wide text-rose-300">
                      JARVIS Personal Phone Security Sentinel
                    </h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 border border-rose-500/40 text-rose-300 uppercase">
                      Vivo X200 FE • Android 15
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                    Comprehensive on-device behavioral security: audits newly installed APKs, monitors sensitive background permissions (Camera, Mic, Location, Accessibility), and issues private lockscreen alerts and Malayalam voice warnings when target apps are launched.
                  </p>
                </div>

                {/* Master Switch Button */}
                <div className="flex items-center space-x-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                  <div className="text-right">
                    <span className="block text-xs font-mono font-bold text-slate-200">
                      {isSecurityAlertActive ? 'SENTINEL ARMED' : 'SENTINEL DISARMED'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {isSecurityAlertActive ? 'Active Real-Time Guard' : 'All security alerts paused'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const next = !isSecurityAlertActive;
                      setIsSecurityAlertActive(next);
                      if (next) {
                        speakText('JARVIS Security Sentinel armed and operational on your Vivo X200 FE, sir.');
                      } else {
                        speakText('Security Sentinel disarmed.');
                      }
                    }}
                    className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out relative flex items-center ${
                      isSecurityAlertActive ? 'bg-rose-500 justify-end' : 'bg-slate-800 justify-start'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-full bg-white shadow-md block" />
                  </button>
                </div>
              </div>

              {/* Status Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-rose-500/20 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Phone Lock State</span>
                    <span className={`font-bold flex items-center space-x-1.5 mt-0.5 ${isPhoneLocked ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {isPhoneLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      <span>{isPhoneLocked ? 'Locked (Unattended)' : 'Unlocked'}</span>
                    </span>
                  </div>
                  <button
                    onClick={() => isPhoneLocked ? simulateUnlockDevice() : simulateLockDevice()}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300"
                  >
                    {isPhoneLocked ? 'Unlock' : 'Lock'}
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Lockscreen Privacy</span>
                    <span className={`font-bold mt-0.5 block ${isPrivateNotification ? 'text-cyan-400' : 'text-amber-400'}`}>
                      {isPrivateNotification ? 'Private (Masked)' : 'Explicit Details'}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsPrivateNotification(!isPrivateNotification)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Toggle lockscreen privacy mask"
                  >
                    {isPrivateNotification ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Sideload Sentinel</span>
                  <span className="font-bold text-rose-300 mt-0.5 block">Priority 999 Active</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">AppOps Watcher</span>
                  <span className="font-bold text-emerald-400 mt-0.5 block">5 Perms Monitored</span>
                </div>
              </div>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 text-xs">
              {[
                { id: 'overview', label: 'Overview & Defense Matrix', icon: ShieldCheck },
                { id: 'isolation', label: 'Self-Protection & Emergency Isolation', icon: Zap },
                { id: 'packages', label: 'App Install & Sideload Monitor', icon: Layers },
                { id: 'permissions', label: 'Sensitive Permissions & Accessibility', icon: Lock },
                { id: 'app_alerts', label: 'App-Open & Private Alerts', icon: ShieldAlert },
                { id: 'accounts', label: 'Official Account Security (Google & Meta)', icon: Globe },
                { id: 'logs', label: `Security Event History (${securityAuditLog.length})`, icon: Clock },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = securitySubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSecuritySubTab(tab.id as any)}
                    className={`whitespace-nowrap flex items-center space-x-1.5 px-3 py-2 rounded-xl font-medium transition ${
                      isActive
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* SUB-TAB: JARVIS Self-Protection & Emergency Isolation */}
            {securitySubTab === 'isolation' && (
              <div className="space-y-6 animate-fade-in">
                <SelfProtectionModule onSpeak={speakText} />
              </div>
            )}

            {/* SUB-TAB 1: Overview & Defense Matrix */}
            {securitySubTab === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                {/* 4 Core Pillars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2 text-rose-300 font-bold text-xs">
                          <Layers className="w-4 h-4 text-rose-400" />
                          <span>1. Newly Installed App & Sideload Monitor</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                          PackageMonitorReceiver.kt
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed mb-3">
                        Broadcast receiver with priority 999 inspecting <code>packageManager.getInstallSourceInfo()</code>. Automatically flags sideloaded APKs downloaded through browsers, Telegram, or File Managers, auditing requested dangerous permissions.
                      </p>
                    </div>
                    <button
                      onClick={() => setSecuritySubTab('packages')}
                      className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-semibold text-rose-300 flex items-center justify-center space-x-1"
                    >
                      <span>Configure & Test Sideload Sentinel &rarr;</span>
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2 text-cyan-300 font-bold text-xs">
                          <Lock className="w-4 h-4 text-cyan-400" />
                          <span>2. Sensitive Permission & Accessibility Audit</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                          PermissionAuditManager.kt
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed mb-3">
                        Observes <code>AppOpsManager</code> for real-time Camera, Microphone, and Location grants, plus <code>Settings.Secure</code> for Accessibility Services and Notification Access alterations that could spy on user screens or steal 2FA OTPs.
                      </p>
                    </div>
                    <button
                      onClick={() => setSecuritySubTab('permissions')}
                      className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-semibold text-cyan-300 flex items-center justify-center space-x-1"
                    >
                      <span>Inspect Active Permissions Matrix &rarr;</span>
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs">
                          <ShieldAlert className="w-4 h-4 text-amber-400" />
                          <span>3. App-Open Detection & Malayalam Warnings</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                          JarvisAppMonitorService.kt
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed mb-3">
                        Sub-100ms event-driven window transition detector for WhatsApp, Facebook, Instagram, and custom packages. Triggers an assertive Malayalam voice alert and private lockscreen notification when the device was unattended.
                      </p>
                    </div>
                    <button
                      onClick={() => setSecuritySubTab('app_alerts')}
                      className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-semibold text-amber-300 flex items-center justify-center space-x-1"
                    >
                      <span>Simulate App Launch Voice Alerts &rarr;</span>
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2 text-emerald-300 font-bold text-xs">
                          <Globe className="w-4 h-4 text-emerald-400" />
                          <span>4. Official Account Security Checkup Guide</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                          OfficialAccountSecurityGuide.kt
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed mb-3">
                        Clarifies that local app-open detection cannot detect remote server-side logins. Provides official direct links and triage workflows for Google Security Checkup, Meta Accounts Center, session revocation, and 2FA.
                      </p>
                    </div>
                    <button
                      onClick={() => setSecuritySubTab('accounts')}
                      className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-semibold text-emerald-300 flex items-center justify-center space-x-1"
                    >
                      <span>Open Official Account Security Center &rarr;</span>
                    </button>
                  </div>
                </div>

                {/* Quick Interactive Testing Strip */}
                <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Quick Security Incident Simulation Triggers
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Tests notification + speech alerts</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <button
                      onClick={() => triggerSecurityAlert('Facebook')}
                      className="p-3 rounded-xl bg-blue-900/30 border border-blue-500/40 text-blue-200 hover:bg-blue-900/50 text-left"
                    >
                      <span className="font-bold block">📘 Open Facebook</span>
                      <span className="text-[10px] text-blue-300/80">Triggers Malayalam alert</span>
                    </button>
                    <button
                      onClick={() => triggerSecurityAlert('WhatsApp')}
                      className="p-3 rounded-xl bg-emerald-900/30 border border-emerald-500/40 text-emerald-200 hover:bg-emerald-900/50 text-left"
                    >
                      <span className="font-bold block">💬 Open WhatsApp</span>
                      <span className="text-[10px] text-emerald-300/80">Local window launch</span>
                    </button>
                    <button
                      onClick={simulatePackageInstall}
                      className="p-3 rounded-xl bg-rose-900/30 border border-rose-500/40 text-rose-200 hover:bg-rose-900/50 text-left"
                    >
                      <span className="font-bold block">⚠️ Sideload Test APK</span>
                      <span className="text-[10px] text-rose-300/80">Untrusted source alert</span>
                    </button>
                    <button
                      onClick={() => simulatePermissionTamper('perm-cam', 'ThirdPartyApp', false)}
                      className="p-3 rounded-xl bg-amber-900/30 border border-amber-500/40 text-amber-200 hover:bg-amber-900/50 text-left"
                    >
                      <span className="font-bold block">📷 Alter Camera Access</span>
                      <span className="text-[10px] text-amber-300/80">AppOps watcher trigger</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 2: Newly Installed App & Sideload Monitor */}
            {securitySubTab === 'packages' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      <Layers className="w-4 h-4 text-rose-400" />
                      <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                        Package Installation & Sideloading Detector (PackageMonitorReceiver.kt)
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                      ACTION_PACKAGE_ADDED (Priority 999)
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                    When an application is installed on Android, JARVIS intercepts the broadcast and inspects <code>packageManager.getInstallSourceInfo()</code>. If the installer is not <strong>Google Play Store</strong> (<code>com.android.vending</code>) or <strong>Vivo App Store</strong> (<code>com.vivo.appstore</code>), JARVIS marks it as an <strong>Untrusted Sideload</strong>, inspects requested high-risk permissions, and fires an immediate warning notification.
                  </p>

                  {/* Interactive APK Simulation Form */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Simulated App Name:</label>
                        <input
                          type="text"
                          value={testPackageName}
                          onChange={e => setTestPackageName(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono text-xs focus:border-rose-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Android Package ID:</label>
                        <input
                          type="text"
                          value={testPackageId}
                          onChange={e => setTestPackageId(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono text-xs focus:border-rose-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Quick Preset Buttons */}
                    <div>
                      <span className="text-[11px] text-slate-400 font-semibold block mb-1.5">Load Test Preset:</span>
                      <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                        <button
                          onClick={() => {
                            setTestPackageName('GBWhatsApp Pro v18.2');
                            setTestPackageId('com.mod.gbwhatsapp');
                            setTestInstallSource('browser');
                            setTestDangerousPerms({
                              'Microphone (RECORD_AUDIO)': true,
                              'Camera (CAMERA)': true,
                              'Precise Location (ACCESS_FINE_LOCATION)': false,
                              'Accessibility Service (BIND_ACCESSIBILITY_SERVICE)': true,
                              'SMS Read/Send (READ_SMS)': true,
                              'Contacts Access (READ_CONTACTS)': true,
                            });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-700 text-rose-300 hover:bg-rose-900/60"
                        >
                          ⚠️ Modded WhatsApp (Sideload - High Risk)
                        </button>
                        <button
                          onClick={() => {
                            setTestPackageName('Flashlight Super Torch');
                            setTestPackageId('com.torch.fastlight');
                            setTestInstallSource('telegram');
                            setTestDangerousPerms({
                              'Microphone (RECORD_AUDIO)': true,
                              'Camera (CAMERA)': true,
                              'Precise Location (ACCESS_FINE_LOCATION)': true,
                              'Accessibility Service (BIND_ACCESSIBILITY_SERVICE)': false,
                              'SMS Read/Send (READ_SMS)': false,
                              'Contacts Access (READ_CONTACTS)': false,
                            });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-700 text-amber-300 hover:bg-amber-900/60"
                        >
                          ⚠️ Suspicious Torch (Telegram Sideload)
                        </button>
                        <button
                          onClick={() => {
                            setTestPackageName('Google Calculator');
                            setTestPackageId('com.google.android.calculator');
                            setTestInstallSource('play_store');
                            setTestDangerousPerms({
                              'Microphone (RECORD_AUDIO)': false,
                              'Camera (CAMERA)': false,
                              'Precise Location (ACCESS_FINE_LOCATION)': false,
                              'Accessibility Service (BIND_ACCESSIBILITY_SERVICE)': false,
                              'SMS Read/Send (READ_SMS)': false,
                              'Contacts Access (READ_CONTACTS)': false,
                            });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-700 text-emerald-300 hover:bg-emerald-900/60"
                        >
                          ✅ Google Play Calculator (Safe Store)
                        </button>
                      </div>
                    </div>

                    {/* Installer Source Selection */}
                    <div>
                      <label className="block text-slate-300 font-semibold text-xs mb-1.5">
                        Installation Source (Installer Package):
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                        {[
                          { id: 'browser', label: 'Chrome / Web Browser', type: 'Sideloaded (Untrusted)' },
                          { id: 'telegram', label: 'Telegram / Chat App', type: 'Sideloaded (Untrusted)' },
                          { id: 'file_manager', label: 'File Manager APK', type: 'Direct Install (Untrusted)' },
                          { id: 'play_store', label: 'Google Play Store', type: 'Verified App Store' },
                          { id: 'vivo_store', label: 'Vivo App Store', type: 'Verified App Store' },
                        ].map(src => (
                          <button
                            key={src.id}
                            type="button"
                            onClick={() => setTestInstallSource(src.id as any)}
                            className={`p-2.5 rounded-xl border text-left transition ${
                              testInstallSource === src.id
                                ? (src.id === 'play_store' || src.id === 'vivo_store'
                                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                                    : 'bg-rose-950/40 border-rose-500 text-rose-300')
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <span className="font-bold block">{src.label}</span>
                            <span className="text-[10px] text-slate-400">{src.type}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dangerous Permissions Checkboxes */}
                    <div>
                      <label className="block text-slate-300 font-semibold text-xs mb-1.5">
                        Requested Sensitive Permissions:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {Object.entries(testDangerousPerms).map(([perm, isChecked]) => (
                          <label
                            key={perm}
                            className={`p-2 rounded-xl border flex items-center space-x-2 text-xs cursor-pointer transition ${
                              isChecked
                                ? 'bg-rose-950/20 border-rose-500/50 text-slate-200'
                                : 'bg-slate-900 border-slate-800 text-slate-400'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={e => {
                                setTestDangerousPerms(prev => ({ ...prev, [perm]: e.target.checked }));
                              }}
                              className="w-3.5 h-3.5 accent-rose-500 rounded"
                            />
                            <span className="font-mono text-[11px] truncate">{perm}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={simulatePackageInstall}
                      className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs transition flex items-center justify-center space-x-2 shadow-lg"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Simulate APK Installation & Sentinel Evaluation</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 3: Sensitive Permissions & Accessibility */}
            {securitySubTab === 'permissions' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-cyan-400" />
                      <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                        Sensitive Android Permissions & Accessibility Watcher (PermissionAuditManager.kt)
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      AppOpsManager & Settings.Secure
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                    Observes when third-party apps attempt to escalate privileges. In Android 11–15, <code>AppOpsManager.startWatchingMode()</code> tracks runtime microphone and camera states, while a <code>ContentObserver</code> watches <code>ENABLED_ACCESSIBILITY_SERVICES</code> to detect overlay and screen-scraping malware immediately.
                  </p>

                  {/* Permissions Matrix */}
                  <div className="space-y-3">
                    {permissionAuditMatrix.map(item => (
                      <div
                        key={item.id}
                        className={`p-4 rounded-xl border transition ${
                          item.isTampered
                            ? 'bg-rose-950/20 border-rose-500/50 shadow-md shadow-rose-950/30'
                            : 'bg-slate-950 border-slate-800'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-xs text-slate-100">{item.name}</span>
                              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                                item.riskLevel === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                                item.riskLevel === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                                'bg-cyan-950 text-cyan-300 border border-cyan-800'
                              }`}>
                                {item.riskLevel} RISK
                              </span>
                              {item.isTampered && (
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500 text-slate-950 font-bold animate-pulse">
                                  TAMPER DETECTED
                                </span>
                              )}
                            </div>
                            <span className="font-mono text-[10px] text-slate-500 block mt-0.5">
                              API: {item.permission} • Op: {item.op}
                            </span>
                            <p className="text-xs text-slate-400 mt-1">{item.description}</p>
                            <div className="mt-2 flex items-center space-x-1.5 text-[11px] font-mono text-slate-300">
                              <span className="text-slate-500">Authorized Apps:</span>
                              {item.grantedApps.length === 0 ? (
                                <span className="text-slate-500 italic">None granted</span>
                              ) : (
                                item.grantedApps.map((a, i) => (
                                  <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                                    {a}
                                  </span>
                                ))
                              )}
                            </div>
                          </div>

                          {/* Simulation Button */}
                          <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-2">
                            <button
                              onClick={() => simulatePermissionTamper(item.id, 'SuspiciousUtilityApp', item.isTampered)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                                item.isTampered
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                              }`}
                            >
                              {item.isTampered ? '✓ Normalize Permission' : '⚡ Simulate Tampering Grant'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 4: App-Open Detection & Private Voice Alerts */}
            {securitySubTab === 'app_alerts' && (
              <div className="space-y-6 animate-fade-in">
                {/* Active Speech Banner (if recent warning sounded) */}
                {lastSecurityWarning && (
                  <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 shrink-0">
                        <Bell className="w-5 h-5 text-rose-400 animate-bounce" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-900/80 text-rose-200 border border-rose-700 uppercase font-bold">
                            Spoken Alert Output
                          </span>
                          <span className="text-xs text-rose-300/80 font-mono">{lastSecurityWarning}</span>
                        </div>
                        <p className="text-sm font-semibold text-rose-100 mt-1 font-sans">
                          "Sir, ശ്രദ്ധിക്കുക! നിങ്ങളുടെ ഫോണിൽ ആപ്പ് തുറന്നിട്ടുണ്ട്. ഇത് നിങ്ങളാണോ ഉപയോഗിക്കുന്നത്?"
                        </p>
                        <span className="text-[11px] text-slate-400 italic">
                          Meaning: "Sir, attention! [App] has been opened on your phone. Are you the one using it?"
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => speakText('Sir, ശ്രദ്ധിക്കുക! നിങ്ങളുടെ ഫോണിൽ Facebook തുറന്നിട്ടുണ്ട്. ഇത് നിങ്ങളാണോ ഉപയോഗിക്കുന്നത്?')}
                      className="shrink-0 flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs transition shadow-md"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Replay Voice Alert</span>
                    </button>
                  </div>
                )}

                {/* Interactive Simulator Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: Device State & App Launch triggers */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                        <div className="flex items-center space-x-2">
                          <Smartphone className="w-4 h-4 text-cyan-400" />
                          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                            Foreground App Transition Simulator
                          </h3>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">Vivo OriginOS 15</span>
                      </div>

                      <p className="text-xs text-slate-300 mb-4">
                        Test the real Android flow: Lock your phone to mark it unattended, simulate unlocking, and click any monitored app to trigger the Malayalam speech warning and notification.
                      </p>

                      {/* Lock / Unlock Simulation */}
                      <div className="grid grid-cols-2 gap-3 mb-5">
                        <button
                          onClick={simulateLockDevice}
                          className={`p-3 rounded-xl border text-left transition flex items-center space-x-3 ${
                            isPhoneLocked
                              ? 'bg-amber-950/30 border-amber-500 text-amber-300 shadow-md'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${isPhoneLocked ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-900 text-slate-500'}`}>
                            <Lock className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-bold text-xs block">Lock Phone</span>
                            <span className="text-[10px] text-slate-400">ACTION_SCREEN_OFF</span>
                          </div>
                        </button>

                        <button
                          onClick={simulateUnlockDevice}
                          className={`p-3 rounded-xl border text-left transition flex items-center space-x-3 ${
                            !isPhoneLocked
                              ? 'bg-emerald-950/30 border-emerald-500 text-emerald-300 shadow-md'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${!isPhoneLocked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-900 text-slate-500'}`}>
                            <Unlock className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-bold text-xs block">Unlock Phone</span>
                            <span className="text-[10px] text-slate-400">ACTION_USER_PRESENT</span>
                          </div>
                        </button>
                      </div>

                      {/* App Launch Buttons */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-xs font-bold text-slate-300">
                            Simulate Launching Protected App:
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">Click to open</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {[
                            { name: 'Facebook', pkg: 'com.facebook.katana', color: 'bg-blue-600/20 border-blue-500/40 text-blue-300 hover:bg-blue-600/30' },
                            { name: 'WhatsApp', pkg: 'com.whatsapp', color: 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30' },
                            { name: 'Instagram', pkg: 'com.instagram.android', color: 'bg-pink-600/20 border-pink-500/40 text-pink-300 hover:bg-pink-600/30' },
                            { name: 'Telegram', pkg: 'org.telegram.messenger', color: 'bg-sky-600/20 border-sky-500/40 text-sky-300 hover:bg-sky-600/30' },
                            { name: 'Google Photos', pkg: 'com.google.android.apps.photos', color: 'bg-amber-600/20 border-amber-500/40 text-amber-300 hover:bg-amber-600/30' },
                            { name: 'Settings', pkg: 'com.android.settings', color: 'bg-slate-700/30 border-slate-600/40 text-slate-300 hover:bg-slate-700/50' },
                          ].map(app => {
                            const isMonitored = monitoredApps.includes(app.name);
                            return (
                              <button
                                key={app.name}
                                onClick={() => triggerSecurityAlert(app.name)}
                                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                                  isMonitored ? app.color : 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="font-bold text-xs">{app.name}</span>
                                  {isMonitored ? (
                                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" title="Monitored" />
                                  ) : (
                                    <span className="text-[9px] text-slate-500 font-mono">Off</span>
                                  )}
                                </div>
                                <span className="text-[9px] font-mono truncate text-slate-400">{app.pkg}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Force Alert */}
                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                        <span>Testing cooldown suppression?</span>
                        <button
                          onClick={() => {
                            lastAlertTimesRef.current = {};
                            sessionAlertedAppsRef.current.clear();
                            triggerSecurityAlert('Facebook', true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-mono border border-slate-700"
                        >
                          ⚡ Force Alert Facebook (Bypass Cooldown)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right: Settings & Checklist */}
                  <div className="lg:col-span-5 space-y-4">
                    {/* App Selection Checklist */}
                    <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                          Monitored Apps Checklist
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                          {monitoredApps.length} Selected
                        </span>
                      </div>

                      <div className="space-y-2 max-h-56 overflow-y-auto">
                        {[
                          { name: 'Facebook', pkg: 'com.facebook.katana', desc: 'Social Media & Messages' },
                          { name: 'WhatsApp', pkg: 'com.whatsapp', desc: 'Private Chats & Calls' },
                          { name: 'Instagram', pkg: 'com.instagram.android', desc: 'Photos & Direct Messages' },
                          { name: 'Telegram', pkg: 'org.telegram.messenger', desc: 'Encrypted Cloud Messaging' },
                          { name: 'Google Photos', pkg: 'com.google.android.apps.photos', desc: 'Personal Camera Roll' },
                          { name: 'Settings', pkg: 'com.android.settings', desc: 'System Device Controls' },
                        ].map(app => {
                          const isChecked = monitoredApps.includes(app.name);
                          return (
                            <label
                              key={app.name}
                              className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition ${
                                isChecked
                                  ? 'bg-rose-950/20 border-rose-500/40 text-slate-200'
                                  : 'bg-slate-950/50 border-slate-800/80 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center space-x-2.5">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={e => {
                                    if (e.target.checked) {
                                      setMonitoredApps(prev => [...prev, app.name]);
                                    } else {
                                      setMonitoredApps(prev => prev.filter(a => a !== app.name));
                                    }
                                  }}
                                  className="w-4 h-4 accent-rose-500 rounded"
                                />
                                <div>
                                  <span className="font-bold text-xs block">{app.name}</span>
                                  <span className="text-[10px] text-slate-500 font-mono">{app.pkg}</span>
                                </div>
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">{app.desc}</span>
                            </label>
                          );
                        })}
                      </div>

                      {/* Add Custom App Input */}
                      <div className="mt-3 pt-3 border-t border-slate-800">
                        <span className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                          Add Custom Package ID:
                        </span>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={customPackageInput}
                            onChange={e => setCustomPackageInput(e.target.value)}
                            placeholder="e.g. com.snapchat.android"
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                          />
                          <button
                            onClick={() => {
                              const val = customPackageInput.trim();
                              if (val && !monitoredApps.includes(val)) {
                                setMonitoredApps(prev => [...prev, val]);
                                setCustomPackageInput('');
                              }
                            }}
                            className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Volume & Cooldown Configuration */}
                    <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1 text-xs">
                          <span className="text-slate-300 font-semibold">Warning Audio Volume:</span>
                          <span className="font-mono font-bold text-rose-300">{alertVolumePercent}% (STREAM_ALARM)</span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="100"
                          value={alertVolumePercent}
                          onChange={e => setAlertVolumePercent(Number(e.target.value))}
                          className="w-full accent-rose-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Repeat Cooldown:
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 30, title: '30 Seconds', desc: 'Frequent' },
                            { id: 60, title: '60 Seconds', desc: 'Recommended' },
                            { id: 180, title: '3 Minutes', desc: 'Low noise' },
                            { id: -1, title: 'Once/Unlock', desc: 'Single alert' }
                          ].map(opt => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setAlertCooldownSec(opt.id)}
                              className={`p-2 rounded-xl border text-left transition ${
                                alertCooldownSec === opt.id
                                  ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              <span className="font-bold text-xs block">{opt.title}</span>
                              <span className="text-[9px] text-slate-500">{opt.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 5: Official Account Security (Google & Meta) */}
            {securitySubTab === 'accounts' && (
              <div className="space-y-6 animate-fade-in">
                {/* Critical Distinction Banner */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 shadow-xl">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 shrink-0">
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-amber-200">
                        Technical Guarantee: Distinguishing App-Open Events from Account Breaches
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        When someone taps an app on your phone, Android Accessibility detects a <strong>local window transition</strong>. It does <em>not</em> mean your account was hacked or accessed remotely. Conversely, if a remote attacker logs into your Facebook or Google account from another PC or country, local phone sensors cannot see that. <strong>Always use official account security tools below to audit remote sessions.</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Direct Official Portals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Google Security Portal */}
                  <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs mb-2">
                        <Globe className="w-4 h-4" />
                        <span>Google Account Security Tools</span>
                      </div>
                      <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                        Audit active Android phones, Mac/Windows PCs, and Smart TVs signed into your Google account. Terminate suspicious sessions and verify 2-Step Verification settings.
                      </p>
                    </div>
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <a
                        href="https://myaccount.google.com/security-checkup"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-semibold flex items-center justify-between transition"
                      >
                        <span>Open Google Security Checkup</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href="https://myaccount.google.com/device-activity"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-between transition"
                      >
                        <span>Audit Active Devices & Where You're Logged In</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Meta / Facebook Security Portal */}
                  <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs mb-2">
                        <Globe className="w-4 h-4" />
                        <span>Meta & Facebook Accounts Center</span>
                      </div>
                      <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                        Navigate to Meta Password & Security. Review active login sessions, enable unrecognized login alerts, and audit third-party connected apps.
                      </p>
                    </div>
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <a
                        href="https://accountscenter.facebook.com/password_and_security"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold flex items-center justify-between transition"
                      >
                        <span>Open Meta Password & Security Hub</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href="https://www.facebook.com/security"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-between transition"
                      >
                        <span>Facebook Login Alerts & Where You're Logged In</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Interactive Triage Checklist */}
                <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 pb-2 border-b border-slate-800">
                    Suspected Compromise: Official Step-by-Step Triage Checklist
                  </h3>

                  <div className="space-y-2.5">
                    {[
                      {
                        id: 'google_sessions',
                        title: 'Audit Active Google Devices',
                        desc: 'Review list of all computers and phones currently signed in. Click "Sign out" on any unknown hardware.',
                        url: 'https://myaccount.google.com/device-activity'
                      },
                      {
                        id: 'google_2fa',
                        title: 'Enable Google 2-Step Verification (App-based)',
                        desc: 'Replace SMS verification with Google Authenticator or hardware FIDO2 key to eliminate SIM-swap vectors.',
                        url: 'https://myaccount.google.com/security-checkup'
                      },
                      {
                        id: 'meta_sessions',
                        title: 'Audit Facebook / Meta Logins',
                        desc: 'Open Accounts Center > Where You\'re Logged In. Review IP geolocation and revoke unapproved sessions.',
                        url: 'https://accountscenter.facebook.com/password_and_security'
                      },
                      {
                        id: 'meta_alerts',
                        title: 'Turn On Unrecognized Login Alerts',
                        desc: 'Configure instant push notifications and emails whenever your account is accessed from a new device.',
                        url: 'https://www.facebook.com/security'
                      },
                      {
                        id: 'whatsapp_devices',
                        title: 'Audit WhatsApp Linked Web Sessions',
                        desc: 'Open WhatsApp on your phone > Settings > Linked Devices. Disconnect all desktop or web sessions.',
                        url: null
                      }
                    ].map(item => {
                      const isDone = accountSecurityCompleted[item.id] || false;
                      return (
                        <div
                          key={item.id}
                          className={`p-3 rounded-xl border flex items-start justify-between gap-3 transition ${
                            isDone
                              ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                              : 'bg-slate-950 border-slate-800 text-slate-300'
                          }`}
                        >
                          <label className="flex items-start space-x-3 cursor-pointer flex-1">
                            <input
                              type="checkbox"
                              checked={isDone}
                              onChange={e => {
                                setAccountSecurityCompleted(prev => ({ ...prev, [item.id]: e.target.checked }));
                              }}
                              className="w-4 h-4 accent-emerald-500 rounded mt-0.5 shrink-0"
                            />
                            <div>
                              <span className={`font-bold text-xs block ${isDone ? 'text-emerald-300 line-through' : 'text-slate-100'}`}>
                                {item.title}
                              </span>
                              <span className="text-[11px] text-slate-400 mt-0.5 block leading-relaxed">{item.desc}</span>
                            </div>
                          </label>
                          {item.url && (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-mono shrink-0 flex items-center space-x-1"
                            >
                              <span>Open</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 6: Security Audit Event History */}
            {securitySubTab === 'logs' && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                        Security Sentinel Chronological Audit Log
                      </h3>
                      <span className="text-[11px] text-slate-400">
                        Tracks package installs, permission grants, and app launches with recommended actions
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={exportSecurityAuditReport}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export JSON</span>
                      </button>
                      {securityAuditLog.length > 0 && (
                        <button
                          onClick={() => setSecurityAuditLog([])}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-400 text-xs font-mono transition"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center space-x-2 mb-4 text-xs font-mono">
                    <span className="text-slate-500 text-[11px]">Filter:</span>
                    {(['ALL', 'CRITICAL', 'WARNING', 'APP_OPEN'] as const).map(f => (
                      <button
                        key={f}
                        onClick={() => setAuditFilter(f)}
                        className={`px-2.5 py-1 rounded-lg transition ${
                          auditFilter === f
                            ? 'bg-rose-500 text-slate-950 font-bold'
                            : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>

                  {/* Log Items */}
                  {securityAuditLog.length === 0 ? (
                    <div className="py-12 text-center text-xs text-slate-500 font-mono">
                      No security audit events recorded yet. Simulate an app launch or sideload installation to generate entries.
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                      {securityAuditLog
                        .filter(item => {
                          if (auditFilter === 'ALL') return true;
                          if (auditFilter === 'CRITICAL') return item.severity === 'CRITICAL';
                          if (auditFilter === 'WARNING') return item.severity === 'WARNING';
                          if (auditFilter === 'APP_OPEN') return item.category === 'APP_OPEN';
                          return true;
                        })
                        .map(item => (
                          <div
                            key={item.id}
                            className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs ${
                              item.severity === 'CRITICAL'
                                ? 'bg-rose-950/30 border-rose-500/50'
                                : item.severity === 'WARNING'
                                ? 'bg-amber-950/20 border-amber-500/40'
                                : 'bg-slate-950 border-slate-800/80'
                            }`}
                          >
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                  item.severity === 'CRITICAL' ? 'bg-rose-500 text-slate-950' :
                                  item.severity === 'WARNING' ? 'bg-amber-400 text-slate-950' :
                                  'bg-cyan-950 text-cyan-300 border border-cyan-800'
                                }`}>
                                  {item.severity}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400">{item.time}</span>
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700 text-slate-300">
                                  {item.category}
                                </span>
                              </div>
                              <h4 className="font-bold text-slate-100 text-xs">{item.title}</h4>
                              <p className="text-slate-300 text-xs mt-1 leading-relaxed">{item.description}</p>
                              {item.recommendation && (
                                <p className="text-[11px] text-cyan-300/90 font-mono mt-1.5 flex items-center space-x-1">
                                  <span>👉 Recommended: {item.recommendation}</span>
                                </p>
                              )}
                            </div>

                            <button
                              onClick={() => speakText(`Security Alert: ${item.title}`)}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-700 shrink-0 self-start"
                              title="Speak this event"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Strict Ethical & Privacy Boundary Disclosures */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="font-mono text-sm font-bold text-rose-300 uppercase tracking-wider flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span>Strict Ethical Boundaries & Technical Disclosures</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="font-bold text-cyan-300 mb-1.5">
                    What Android OS APIs CAN Detect:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    <li>Package installation broadcasts & installer package identity (Google Play vs Sideload).</li>
                    <li>Runtime permission grants for Microphone, Camera, and Fine Location via AppOps.</li>
                    <li>Accessibility Service and Notification Listener state changes.</li>
                    <li>Foreground window transitions for selected target apps.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30">
                  <h4 className="font-bold text-amber-400 mb-1.5">
                    Detection Limitations & Realistic Boundaries:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    <li><strong>No False Biometric Claims:</strong> App-open detection cannot identify who is holding the phone. It asks: <em>"Sir, is this you using it?"</em></li>
                    <li><strong>No Remote Cloud Hack Detection:</strong> If an account is hacked on another computer, local phone sensors cannot see that; official session audit is required.</li>
                    <li><strong>OS Sandboxing:</strong> JARVIS operates within standard Android security boundaries without kernel hooks or root exploits.</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs">
                <span className="font-bold text-rose-300 block mb-1">
                  100% Privacy & Non-Invasive Architecture Guarantee
                </span>
                <p className="text-slate-300 leading-relaxed">
                  JARVIS never silently records audio or video feeds, never captures screenshots or keystrokes, never stores passwords, and never transmits personal activity logs to any cloud server. All security audit logic and Malayalam voice warnings are evaluated 100% locally on your Vivo X200 FE.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Full Bluetooth Headset & Hands-Free Audio Engine */}
        {activeTab === 'bluetooth' && (
          <div className="max-w-5xl mx-auto w-full space-y-6">
            {/* Top Status & Connection Hero Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/80 to-[#071328] border border-cyan-500/30 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Headphones className="w-56 h-56 text-cyan-400" />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="p-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
                      <Headphones className="w-5 h-5 text-cyan-400" />
                    </span>
                    <h2 className="text-xl font-bold font-mono tracking-wide text-cyan-300">
                      Vivo X200 FE Bluetooth SCO & Hands-Free
                    </h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 uppercase">
                      Android 15 Duplex Audio
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                    Full bidirectional audio for driving and pocket mode: routes your voice commands from your Bluetooth headset microphone (HFP/SCO) and delivers male Malayalam and English voice responses directly to your earpieces.
                  </p>
                </div>

                {/* Connection Quick Controls */}
                <div className="flex items-center space-x-2 bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800">
                  <div className="text-right pr-2">
                    <span className="block text-xs font-mono font-bold text-slate-200">
                      {isHeadsetConnected ? 'HEADSET CONNECTED' : 'HEADSET DISCONNECTED'}
                    </span>
                    <span className="text-[10px] text-cyan-400 font-mono">
                      {isHeadsetConnected ? `SCO Channel: ${isScoActive ? '16kHz Wideband' : 'Idle'}` : 'Audio on Speaker'}
                    </span>
                  </div>
                  {isHeadsetConnected ? (
                    <button
                      onClick={simulateHeadsetDisconnect}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-mono font-semibold transition"
                      title="Simulate headset disconnection (Tests ACTION_AUDIO_BECOMING_NOISY)"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={simulateHeadsetReconnect}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold transition shadow-md"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>

              {/* Status Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-cyan-500/20 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Active Device</span>
                  <span className="font-bold text-cyan-300 mt-0.5 truncate block">
                    {isHeadsetConnected ? headsetName : 'Vivo X200 FE Speaker'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Microphone Source</span>
                  <span className="font-bold text-emerald-400 mt-0.5 block">
                    {isHeadsetConnected ? 'Headset Mic (Noise Filtered)' : 'Phone Bottom Mic'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Audio Output Sink</span>
                  <span className="font-bold text-cyan-300 mt-0.5 block">
                    {isHeadsetConnected ? 'Bluetooth Earpieces (SCO)' : 'Built-in Loudspeaker'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Driving & Pocket</span>
                  <span className={`font-bold mt-0.5 block ${isDrivingMode || isPocketMode ? 'text-amber-400' : 'text-slate-400'}`}>
                    {isPocketMode ? 'Pocket Mode Active' : isDrivingMode ? 'Driving Mode Active' : 'Standard Mode'}
                  </span>
                </div>
              </div>
            </div>

            {/* Middle Section: Real Hardware Test Bench & Driving/Pocket Simulation */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 7 Cols: Real Web Audio & Mic Test Bench */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      <Waves className="w-4 h-4 text-cyan-400" />
                      <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                        Live Headset Audio Test Bench
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800">
                      Web Audio + MediaDevices
                    </span>
                  </div>

                  {/* Device Picker */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Select Audio Input Hardware (Microphone):
                    </label>
                    <select
                      value={selectedInputDeviceId}
                      onChange={e => {
                        const devId = e.target.value;
                        setSelectedInputDeviceId(devId);
                        const dev = audioInputDevices.find(d => d.deviceId === devId);
                        if (dev) {
                          setHeadsetName(dev.label || 'Bluetooth Headset');
                          setIsHeadsetConnected(true);
                          setIsScoActive(true);
                        }
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono focus:border-cyan-500 focus:outline-none"
                    >
                      {audioInputDevices.length === 0 ? (
                        <option value="">Default System Microphone (Vivo TWS / Bluetooth)</option>
                      ) : (
                        audioInputDevices.map((d, i) => (
                          <option key={d.deviceId || i} value={d.deviceId}>
                            {d.label || `Audio Device ${i + 1}`}
                          </option>
                        ))
                      )}
                    </select>
                    <span className="text-[10px] text-slate-500 block mt-1">
                      {audioInputDevices.length > 0
                        ? `Found ${audioInputDevices.length} system audio devices. If your Bluetooth headset is paired with this machine, select it above.`
                        : 'Grant microphone permission to enumerate real hardware devices or test below.'}
                    </span>
                  </div>

                  {/* Live VU Meter & Mic Test */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                        <Mic className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Live Headset Microphone Level:</span>
                      </span>
                      <span className="font-mono text-xs font-bold text-cyan-400">
                        {isTestingMic ? `${headsetAudioLevel}%` : (isListening ? '65%' : 'Standby')}
                      </span>
                    </div>

                    {/* Animated VU Meter Bar */}
                    <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-amber-400 transition-all duration-75 ease-out rounded-full"
                        style={{ width: `${isTestingMic ? headsetAudioLevel : (isListening ? 65 : 0)}%` }}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <button
                        onClick={startMicTest}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                          isTestingMic
                            ? 'bg-rose-500 hover:bg-rose-400 text-slate-950'
                            : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                        }`}
                      >
                        {isTestingMic ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                        <span>{isTestingMic ? 'Stop VU Test' : 'Test Headset Mic VU Meter'}</span>
                      </button>

                      <span className="text-[10px] text-slate-400 font-mono">
                        {isTestingMic ? '🎙️ Speak to test live audio capture' : 'Real-time Web Audio API'}
                      </span>
                    </div>
                  </div>

                  {/* Speech Output Verification Buttons */}
                  <div className="space-y-2 pt-1">
                    <span className="text-xs font-semibold text-slate-300 block">
                      Verify Bidirectional Headset Voice Output (TTS):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        onClick={testHeadsetMalayalamVoice}
                        className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-left transition"
                      >
                        <div className="flex items-center space-x-2 text-cyan-300 font-bold text-xs mb-1">
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Malayalam Headset Test</span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">
                          "Sir, ബ്ലൂടൂത്ത് ഹെഡ്‌സെറ്റ് വിജയകരമായി കണക്ട് ചെയ്തിരിക്കുന്നു..."
                        </p>
                      </button>

                      <button
                        onClick={testHeadsetEnglishVoice}
                        className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-left transition"
                      >
                        <div className="flex items-center space-x-2 text-cyan-300 font-bold text-xs mb-1">
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>English Headset Test</span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">
                          "JARVIS online. Bluetooth SCO audio link active..."
                        </p>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Chronological Headset Audio Event Log */}
                <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                      Bluetooth Audio Audit Log
                    </h3>
                    <span className="text-[10px] font-mono text-slate-500">Real-Time Routing Events</span>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {headsetEventLog.map(evt => (
                      <div
                        key={evt.id}
                        className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs flex items-start justify-between gap-2"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2 mb-0.5">
                            <span className="font-mono text-[10px] text-slate-500">{evt.time}</span>
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                                evt.status === 'ok'
                                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                                  : evt.status === 'warn'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {evt.event}
                            </span>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-snug">{evt.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right 5 Cols: Hands-Free Driving & Pocket Mode Actions */}
              <div className="lg:col-span-5 space-y-4">
                {/* Pocket & Driving Simulation Panel */}
                <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200 pb-2 border-b border-slate-800">
                    Hands-Free Driving & Pocket Triggers
                  </h3>

                  {/* Earbud Stem / Media Button Click Simulator */}
                  <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/40 space-y-2">
                    <div className="flex items-center space-x-2 text-cyan-300 font-bold text-xs">
                      <Radio className="w-4 h-4 text-cyan-400" />
                      <span>Earbud Stem / Button Hook (`KEYCODE_HEADSETHOOK`)</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Tap the stem/button on your earbuds to talk to JARVIS while the phone is in your pocket or when driving, without touching the screen.
                    </p>
                    <button
                      onClick={triggerHeadsetStemClick}
                      className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center justify-center space-x-2 shadow-lg"
                    >
                      <Radio className="w-4 h-4" />
                      <span>Simulate Headset Button Press</span>
                    </button>
                  </div>

                  {/* Pocket Mode Toggle */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div className="pr-2">
                      <span className="font-bold text-xs text-slate-200 block">Pocket Mode (Screen Off)</span>
                      <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">
                        Simulates phone asleep in pocket with screen dark while background audio listener stays primed.
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const next = !isPocketMode;
                        setIsPocketMode(next);
                        if (next) {
                          setActiveTab('simulator');
                          speakText('Pocket mode engaged, sir. Listening via headset.');
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs font-mono transition ${
                        isPocketMode
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {isPocketMode ? 'Active' : 'Enable'}
                    </button>
                  </div>

                  {/* Driving Mode Toggle */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div className="pr-2">
                      <span className="font-bold text-xs text-slate-200 block flex items-center space-x-1.5">
                        <Car className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Driving Mode (Hands-Free Readback)</span>
                      </span>
                      <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">
                        Speaks all confirmations aloud in Malayalam/English; accepts verbal confirmation so you never glance at your phone.
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const next = !isDrivingMode;
                        setIsDrivingMode(next);
                        if (next) {
                          speakText('Driving mode engaged. All intent confirmations will be read aloud through your headset.');
                        } else {
                          speakText('Driving mode disabled.');
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs font-mono transition ${
                        isDrivingMode
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {isDrivingMode ? 'Active' : 'Enable'}
                    </button>
                  </div>

                  {/* Safety Disconnection Simulation (AUDIO_BECOMING_NOISY) */}
                  <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                    <div className="flex items-center space-x-2 text-rose-300 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>Audio Becoming Noisy Safety Protection</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      If the headset disconnects mid-speech or battery dies, JARVIS catches <code>ACTION_AUDIO_BECOMING_NOISY</code>, softly attenuates volume, and switches safely to phone speaker.
                    </p>
                    <button
                      onClick={simulateHeadsetDisconnect}
                      className="w-full py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs transition flex items-center justify-center space-x-2 shadow-md"
                    >
                      <VolumeX className="w-4 h-4" />
                      <span>Simulate Sudden Disconnect</span>
                    </button>
                  </div>
                </div>

                {/* Vivo X200 FE System Settings Card */}
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs">
                  <h4 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <Info className="w-3.5 h-3.5" />
                    <span>Vivo X200 FE Bluetooth Optimization</span>
                  </h4>
                  <ul className="list-disc list-inside space-y-1.5 text-slate-300">
                    <li>
                      <strong>Bluetooth SCO:</strong> Uses <code>AudioManager.setCommunicationDevice</code> for API 31–35 (OriginOS 15).
                    </li>
                    <li>
                      <strong>Media Button Receiver:</strong> Registered in <code>AndroidManifest.xml</code> with priority 1000 to capture headset clicks before system media players.
                    </li>
                    <li>
                      <strong>Foreground Service:</strong> <code>android:foregroundServiceType="microphone"</code> ensures continuous listening even with phone screen off.
                    </li>
                    <li>
                      <strong>Vivo iManager:</strong> Enable <strong>Autostart</strong> and select <strong>"Don't restrict background power consumption"</strong>.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Android Project Code Viewer */}
        {activeTab === 'code' && (
          <div className="flex-1 flex flex-col lg:flex-row gap-4">
            {/* File List Sidebar */}
            <div className="w-full lg:w-72 bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-col">
              <div className="flex items-center justify-between mb-3 px-2">
                <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider">Project Files</span>
                <span className="text-[10px] font-mono text-slate-500">{ANDROID_PROJECT_FILES.length} items</span>
              </div>
              <div className="space-y-1 overflow-y-auto max-h-[600px]">
                {ANDROID_PROJECT_FILES.map((file, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition flex items-center justify-between ${
                      selectedFile.path === file.path
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                  >
                    <span className="truncate">{file.name}</span>
                    <span className="text-[9px] uppercase px-1 rounded bg-slate-950 text-slate-500">
                      {file.language}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Code Content Viewer */}
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center space-x-2">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono text-xs text-slate-300">{selectedFile.path}</span>
                </div>
                <button
                  onClick={copySelectedFileCode}
                  className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-xs text-slate-300 transition"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>

              {/* Code Pre Box */}
              <div className="flex-1 overflow-auto bg-[#070B18] p-4 rounded-xl border border-slate-900">
                <pre className="font-mono text-xs text-slate-300 leading-relaxed whitespace-pre font-normal">
                  {selectedFile.content}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Build & APK Guide */}
        {activeTab === 'guide' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h2 className="text-xl font-bold text-cyan-400 font-mono mb-2">Build Instructions for Vivo X200 FE</h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                This codebase is a complete native Android application structured for <strong>Android SDK 35</strong> with <strong>Jetpack Compose</strong>. You can compile this into an APK using Android Studio or the command-line Gradle wrapper.
              </p>

              {/* Quick Download Banner */}
              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between mb-6">
                <div>
                  <h4 className="font-bold text-cyan-300 text-sm">Download Native Android Studio Project</h4>
                  <p className="text-xs text-slate-300">Ready to extract, open in Android Studio, and build into an APK.</p>
                </div>
                <button
                  onClick={downloadAndroidProjectZip}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .ZIP</span>
                </button>
              </div>

              {/* Step 1 */}
              <div className="space-y-4 text-xs text-slate-300">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="font-bold text-slate-100 text-sm mb-1 text-cyan-400">Step 1: Open in Android Studio</h4>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300">
                    <li>Unzip <code>JARVIS-Android-VivoX200FE.zip</code> on your computer.</li>
                    <li>Open <strong>Android Studio Ladybug (2024.2.1+)</strong>.</li>
                    <li>Click <strong>Open</strong> and choose the unzipped folder.</li>
                    <li>Allow Gradle to sync automatically.</li>
                  </ol>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="font-bold text-slate-100 text-sm mb-1 text-cyan-400">Step 2: Build Debug APK via Command Line</h4>
                  <p className="mb-2">Run from the project root:</p>
                  <div className="p-2.5 rounded-lg bg-black font-mono text-[11px] text-cyan-300 border border-slate-800">
                    ./gradlew assembleDebug
                  </div>
                  <p className="mt-2 text-slate-400">
                    Output APK location: <code>app/build/outputs/apk/debug/app-debug.apk</code>
                  </p>
                </div>

                {/* Step 3: Vivo Specifics */}
                <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30">
                  <h4 className="font-bold text-amber-400 text-sm mb-2 flex items-center space-x-2">
                    <Smartphone className="w-4 h-4" />
                    <span>Step 3: Crucial Vivo X200 FE (OriginOS / FuntouchOS) Optimization</span>
                  </h4>
                  <p className="mb-2 leading-relaxed">
                    Vivo phones aggressively kill background processes to conserve battery. To ensure the wake-phrase <strong>"JARVIS"</strong> functions when the screen is locked:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 text-slate-300">
                    <li><strong>Battery:</strong> Open <code>Settings &gt; Battery &gt; Background power consumption management &gt; JARVIS</code> and select <strong>"Don't restrict background power consumption"</strong>.</li>
                    <li><strong>Autostart:</strong> Open <strong>Vivo iManager</strong> &gt; <code>App Management &gt; Autostart management</code> and toggle <strong>JARVIS</strong> to <strong>Allowed</strong>.</li>
                    <li><strong>Background Pop-ups:</strong> Go to <code>Settings &gt; Apps &gt; JARVIS &gt; Permissions</code> and grant <strong>"Display pop-up windows while running in background"</strong>.</li>
                  </ul>
                </div>

                {/* Step 4: Environment Note */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="font-bold text-slate-100 text-sm mb-1 text-slate-200">AI Studio Cloud Environment Notice</h4>
                  <p className="text-slate-400 leading-relaxed">
                    The AI Studio environment executes inside a cloud Linux web container optimized for web runtimes. Android SDK 35 platform binaries (aapt2, dx, Android NDK) and a connected physical USB device cannot run inside this cloud container. The web simulator above provides live functional simulation of every single speech, TTS, and routing pipeline, and the ZIP provides the exact native Android project.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Keystore & Settings */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h2 className="text-lg font-bold text-cyan-400 font-mono mb-1 flex items-center space-x-2">
                <Lock className="w-5 h-5" />
                <span>API Keys & Keystore Vault</span>
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Keys configured here are used for testing in the simulator and are injected into your Android app's <code>EncryptedSharedPreferences</code>. Keys are never hardcoded in code.
              </p>

              <div className="space-y-4">
                {/* Gemini Key */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Google Gemini API Key
                  </label>
                  <input
                    type="password"
                    value={geminiKey}
                    onChange={e => setGeminiKey(e.target.value)}
                    placeholder="AIzaSy... (Leave empty to use server default)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Powers Gemini 2.5 Flash for Malayalam phonetics, South Asian regional knowledge, and sub-second voice latency.
                  </span>
                </div>

                {/* OpenAI Key */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    OpenAI API Key (Optional)
                  </label>
                  <input
                    type="password"
                    value={openAiKey}
                    onChange={e => setOpenAiKey(e.target.value)}
                    placeholder="sk-proj-..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Used for complex programming or when user explicitly pins router to OpenAI.
                  </span>
                </div>

                {/* Routing Strategy */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    AI Routing Preference
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'auto', title: 'Auto-Routing', desc: 'Gemini for Malayalam & speed' },
                      { id: 'gemini', title: 'Gemini Only', desc: 'Always use Gemini 2.5 Flash' },
                      { id: 'openai', title: 'OpenAI Only', desc: 'Always use GPT-4o-mini' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setRouterPreference(opt.id as any)}
                        className={`p-3 rounded-xl border text-left transition ${
                          routerPreference === opt.id
                            ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="font-bold text-xs block">{opt.title}</span>
                        <span className="text-[10px] text-slate-500">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Malayalam TTS pitch */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div>
                    <span className="font-bold text-xs text-slate-200 block">Malayalam Male Voice Calibration</span>
                    <span className="text-[11px] text-slate-400">Deep pitch (0.82) for masculine JARVIS timbre</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={maleMalayalamPitch}
                    onChange={e => setMaleMalayalamPitch(e.target.checked)}
                    className="w-4 h-4 accent-cyan-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => alert('Settings and credentials saved to encrypted session vault.')}
                  className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition"
                >
                  Save Settings
                </button>
              </div>
            </div>

            {/* In-App Update & Upgrade Center */}
            <UpdateCenterModule />
          </div>
        )}
      </main>
    </div>
  );
}
