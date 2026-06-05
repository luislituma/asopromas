interface SignatureBoxProps {
  signatures: {
    role: string;
    name?: string;
  }[];
}

export function SignatureBox({ signatures }: SignatureBoxProps) {
  return (
    <div className="hidden print:block mt-16 pt-8 avoid-page-break">
      <div className="flex justify-between items-end gap-8">
        {signatures.map((sig, idx) => (
          <div key={idx} className="flex-1 text-center">
            <div className="border-t border-black pt-2 mx-4">
              <p className="font-bold text-sm text-black m-0 p-0">{sig.role}</p>
              {sig.name && <p className="text-xs text-black mt-1 m-0 p-0">{sig.name}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
