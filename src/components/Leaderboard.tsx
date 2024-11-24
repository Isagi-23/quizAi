import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Medal } from "lucide-react";
import axios from "axios";

interface LeaderboardEntry {
  participantName: string;
  score: number;
  completionTime: number;
  // rank: number
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export function Leaderboard(id: any) {
  console.log(id);
  const [loading, setLoading] = useState(true);
  const [entries, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [sortBy, setSortBy] = useState<"rank" | "score" | "time">("rank");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const sortedData = entries.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score; // Sort by score in descending order
    }
    return a.completionTime - b.completionTime; // Sort by completionTime in ascending order if scores are the same
  });
  console.log(sortedData);
  const toggleSort = (column: "rank" | "score" | "time") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const fetchLeaderboard = async () => {
    setLoading(true); // Ensure loading is true when fetching starts
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await axios.get(`/api/fetchLeaderboard?id=${id.id}`);
      console.log(response.data.data);
      setLeaderboard(response.data.data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false); // Set loading to false only after the fetch is complete
    }
  };
  useEffect(() => {
    fetchLeaderboard();
  }, [id.id]);
  return (
    <>
      {loading || entries.length === 0 ? (
        <div>Getting your leaderboard Please Wait!!!!!...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <Button variant="ghost" onClick={() => toggleSort("rank")}>
                  Rank
                  {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
                </Button>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleSort("score")}>
                  Score
                  {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" onClick={() => toggleSort("time")}>
                  Time (s)
                  {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData?.map((entry, i) => (
              <TableRow key={i} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium">
                  {i < 3 ? (
                    <Badge
                      variant={
                        i + 1 === 1
                          ? "default"
                          : i + 1 === 2
                          ? "secondary"
                          : "outline"
                      }
                    >
                      <Medal className="w-4 h-4 mr-1" />
                      {i + 1}
                    </Badge>
                  ) : (
                    i + 1
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={`https://api.dicebear.com/6.x/initials/svg?seed=${entry.participantName}`}
                      />
                      <AvatarFallback>
                        {entry?.participantName?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{entry?.participantName}</span>
                  </div>
                </TableCell>
                <TableCell>{entry?.score}</TableCell>
                <TableCell className="text-right">
                  {entry?.completionTime}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
