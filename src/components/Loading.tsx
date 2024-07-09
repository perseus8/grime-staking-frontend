import ClipLoader from "react-spinners/ClipLoader";

const Loading = () => {
  return (
    <div className="w-full">
      <div className="m-auto table">
        <ClipLoader
          color={"#fff"}
          loading={true}
          size={15}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    </div>
  );
};

export default Loading;
