// Redirect: /europe/denmark → /country/denmark (canonical)
import { redirect } from 'next/navigation';

export default function DenmarkEuropeRedirect() {
  redirect('/country/denmark');
}