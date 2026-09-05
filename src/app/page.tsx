import { HomeCollage } from "./HomeCollage";
import { getHome, getRecords, getHobbies } from "@/lib/content";

export default async function HomePage() {
  const [home, records, hobbies] = await Promise.all([
    getHome(),
    getRecords(),
    getHobbies(),
  ]);
  return (
    <HomeCollage
      hero={home.hero}
      latest={home.latest}
      current={home.current}
      chaos={home.chaos}
      shelf={records.slice(0, 4)}
      hobbies={hobbies}
    />
  );
}
