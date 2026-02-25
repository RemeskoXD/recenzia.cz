import { AnimatedDiv } from '../components/AnimatedDiv';

export default function NotFoundPage() {
  return (
    <AnimatedDiv className="text-center">
      <h2 className="text-3xl font-bold mb-4">404 - Stránka nenalezena</h2>
      <p>Omlouváme se, ale požadovaná stránka neexistuje.</p>
    </AnimatedDiv>
  );
}
