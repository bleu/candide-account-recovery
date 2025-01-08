const Header = () => (
  <header className="flex h-32 items-center justify-around gap-4 mx-8">
    <div className="flex flex-1 justify-center">
      <h1 className="text-primary font-bold text-lg font-roboto-mono text-center">
        Safe Account Recovery
      </h1>
    </div>
    {/* TODO: build after installing bleu-ui */}
    <input className="bg-content-background flex-1 " />
    <div className="flex flex-1 justify-center">
      <button className="bg-primary text-primary-foreground py-2 px-4 rounded-lg font-roboto-mono ">
        Connect wallet
      </button>
    </div>
  </header>
);
export default Header;
