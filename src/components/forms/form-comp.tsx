export function FormTitle({ children }: { children: string }) {
  return (
    <h2 className="font-semibold text-lg py-0 pb-2 pl-4 px-2 bg-blue-3 border-b">
      {children}
    </h2>
  );
}

export function FormWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 pt-0">
      {children}
    </div>
  );
}

export function FormButtons({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-start items-center pt-4 pl-8">{children}</div>
  );
}

export function InputWrapper({
  children,
  label,
  description = "",
  error,
}: {
  children: React.ReactNode;
  label: string;
  description?: string;
  error?: string;
}) {
  return (
    <div className="space-y-1 mb-1 mx-4">
      <label className="font-semibold capitalize">{label}</label>
      {children}
      <div
        className={`font-light text-sm ${
          error ? "text-red-500" : " text-gray-500"
        }`}
      >
        {error ? error : description}
      </div>
    </div>
  );
}
