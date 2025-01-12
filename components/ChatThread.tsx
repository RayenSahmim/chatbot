"use client";

import { useState } from "react";
import { MessageSquare, Edit, Trash2, CircleCheckBig } from "lucide-react";
import { ChatSession } from "@/types";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "./ui/input";

interface ChatThreadProps {
  session: ChatSession;
  isActive: boolean;
  onClick: () => void;
  setSessions: React.Dispatch<React.SetStateAction<ChatSession[]>>;
  setActiveSessionId: React.Dispatch<React.SetStateAction<string | undefined>>;
  activeSessionId: string | undefined;
}

export function ChatThread({ isActive, onClick, session, setSessions, setActiveSessionId, activeSessionId }: ChatThreadProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(session.name);

  const handleEdit = async () => {
    try {
      const res = await fetch("/api/sessions/", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: session._id, name: editedName }),
      });

      if (res.ok) {
        setSessions((prevSessions) =>
          prevSessions.map((s) =>
            s._id === session._id ? { ...s, name: editedName } : s
          )
        );
        console.log("Session updated successfully");
      } else {
        console.error("Failed to update session", res.statusText);
      }
    } catch (error) {
      console.error("Error updating session:", error);
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch("/api/sessions/", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: session._id }),
      });

      if (res.ok) {
        setSessions((prevSessions) => prevSessions.filter((s) => s._id !== session._id));
        if (session._id === activeSessionId) {
          setActiveSessionId(undefined);
        }
        console.log("Session deleted successfully");
      } else {
        console.error("Failed to delete session", res.statusText);
      }
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  return (
    <button
      onClick={onClick}
      key={session._id}
      onDoubleClick={() => setIsEditing(true)}
      className={`group flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
        isActive ? "bg-gray-100 dark:bg-gray-700" : ""
      }`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/50">
        <MessageSquare className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
      </div>
      <div className="flex-1 overflow-hidden flex justify-between items-center px-5 py-2">
        <div className="flex flex-col">
          {isEditing ? (
            <Input
              value={editedName}
              type="text"
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleEdit}
              className="focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:focus:ring-purple-400 dark:bg-gray-800 dark:text-gray-200"
            />
          ) : (
            <p className="font-medium text-gray-900 dark:text-gray-100">{session.name}</p>
          )}
          <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">
            {format(new Date(session.timestamp), "hh:mm a")}
          </p>
        </div>
        <div className="flex gap-2">
          {!isEditing && (
            <Edit
              className="h-4 w-4 text-purple-500 dark:text-purple-400 hidden group-hover:block"
              onClick={() => setIsEditing(true)}
            />
          )}
          {isEditing && (
            <CircleCheckBig
              className="h-4 w-4 text-purple-500 dark:text-purple-400 cursor-pointer"
              onClick={handleEdit}
            />
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Trash2
                className={`h-4 w-4 text-gray-500 dark:text-gray-400 ${
                  isEditing ? "hidden" : "hidden group-hover:block"
                }`}
              />
            </AlertDialogTrigger>
            <AlertDialogContent className="dark:bg-gray-800">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-purple-500 dark:text-purple-400">
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="dark:text-gray-300">
                  This action cannot be undone. This will permanently delete the chat session.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="text-purple-500 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-purple-500 dark:bg-purple-600 hover:bg-purple-700 dark:hover:bg-purple-700 text-white"
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </button>
  );
}