import { useGetCollections } from "./hooks/useGetCollections";

const DashboardHomePage = () => {
  const { data } = useGetCollections();
  console.log(data?.data.collections);
  return (
    <div>
      {data && data.data.collections.length > 0 ? (
        <h1>Collections {data.data.collections.length}</h1>
      ) : (
        <h1>you have no collections yet!</h1>
      )}
    </div>
  );
};

export default DashboardHomePage;
