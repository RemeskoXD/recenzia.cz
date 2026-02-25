import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star } from 'lucide-react';

export default function WidgetPage() {
  const { companyId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/widget/${companyId}/data`)
      .then(res => res.json())
      .then(setData)
      .catch(() => {});
  }, [companyId]);

  if (!data) return null;

  return (
    <div className="font-sans flex items-center gap-3 p-2">
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className="font-bold text-lg text-slate-800">{data.average}</span>
          <div className="flex text-amber-400">
            {[1, 2, 3, 4, 5].map(star => (
              <Star 
                key={star} 
                size={16} 
                fill={star <= Math.round(data.average) ? "currentColor" : "none"} 
                className={star <= Math.round(data.average) ? "text-amber-400" : "text-slate-200"}
              />
            ))}
          </div>
        </div>
        <span className="text-xs text-slate-500 font-medium">Na základě {data.total} hodnocení</span>
      </div>
    </div>
  );
}
