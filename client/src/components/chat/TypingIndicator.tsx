

const TypingIndicator = () => {
  return (
    <div className="flex justify-center px-3 py-2 w-fit rounded-2xl mb-4 bg-primary/70 ml-auto">
      <span className="h-2 w-2 rounded-full bg-muted animate-bounce [animation-delay:-0.32s]" />
      <span className="h-2 w-2 rounded-full bg-muted animate-bounce [animation-delay:-0.16s]" />
      <span className="h-2 w-2 rounded-full bg-muted animate-bounce" />
    </div>
  );
}

export default TypingIndicator