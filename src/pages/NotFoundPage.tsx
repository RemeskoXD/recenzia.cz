import { AnimatedDiv } from '../components/AnimatedDiv';
import { useLanguage } from '../contexts/LanguageContext';

export default function NotFoundPage() {
  const { t } = useLanguage();
  return (
    <AnimatedDiv className="text-center">
      <h2 className="text-3xl font-bold mb-4">{t('notFoundTitle')}</h2>
      <p>{t('notFoundText')}</p>
    </AnimatedDiv>
  );
}
