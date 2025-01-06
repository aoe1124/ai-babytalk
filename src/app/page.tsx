import MainLayout from '@/components/layout/MainLayout';
import ChatWindow from '@/components/chat/ChatWindow';

export default function Home() {
  return (
    <MainLayout showSidebar={true}>
      <ChatWindow />
    </MainLayout>
  );
}
