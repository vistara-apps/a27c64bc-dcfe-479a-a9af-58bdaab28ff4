import { DrawInterface } from '../components/DrawInterface';
import { Header } from '../components/Header';
import { TicketPurchase } from '../components/TicketPurchase';
import { UserTickets } from '../components/UserTickets';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg">
      <div className="max-w-xl mx-auto px-4">
        <Header />
        <div className="space-y-6">
          <DrawInterface />
          <TicketPurchase />
          <UserTickets />
        </div>
      </div>
    </main>
  );
}
