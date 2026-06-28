import { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
}

export default function Accordion({ items, allowMultiple = false }: AccordionProps) {
  const [openIndices, setOpenIndices] = useState<number[]>([]);

  const toggle = (index: number) => {
    if (allowMultiple) {
      setOpenIndices((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setOpenIndices((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  return (
    <div className="w-full">
      {items.map((item, index) => (
        <AccordionItemComponent
          key={index}
          item={item}
          isOpen={openIndices.includes(index)}
          onToggle={() => toggle(index)}
        />
      ))}
    </div>
  );
}

function AccordionItemComponent({
  item,
  isOpen,
  onToggle,
}: {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="border-t"
      style={{ borderColor: 'var(--cf-border-light)' }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left group cursor-pointer"
        aria-expanded={isOpen}
      >
        <span
          className="text-base font-medium pr-4 transition-colors duration-300 group-hover:text-[#6CBE11]"
          style={{ color: isOpen ? 'var(--cf-green)' : 'var(--cf-black)' }}
        >
          {item.question}
        </span>
        <span
          className="shrink-0 w-5 h-5 flex items-center justify-center transition-all duration-300"
          style={{
            color: isOpen ? 'var(--cf-green)' : 'var(--cf-gray)',
            transform: isOpen ? 'rotate(0deg)' : 'rotate(0deg)',
          }}
        >
          {isOpen ? <X size={20} /> : <Plus size={20} />}
        </span>
      </button>
      <div className="grid transition-[grid-template-rows] duration-300 ease-in-out" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
        <div className="min-h-0 overflow-hidden">
          <div className="pb-5">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--cf-gray-medium)' }}>
            {item.answer}
          </p>
          </div>
        </div>
      </div>
    </div>
  );
}
