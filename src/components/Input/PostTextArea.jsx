import React, { useState, useRef, useCallback, useEffect } from "react";
import searchService from "../../services/searchService";
import UserImageInput from "./UserImageInput";
import useDetectKeyboardOpen from "use-detect-keyboard-open";

const useDebounce = (func, delay) => {
  const timer = useRef(null);

  const debouncedFunc = useCallback(
    (...args) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        func(...args);
      }, delay);
    },
    [func, delay]
  );

  return debouncedFunc;
};

function PostTextArea({
  mentionList,
  content,
  setContent,
  setMentionList,
  textIsEmpty,
  settextIsEmpty,
}) {
  const [showUserList, setShowUserList] = useState(false);
  const [mentionStart, setMentionStart] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const [maxLength] = useState(280);
  const isKeyboardOpen = useDetectKeyboardOpen();
  // const [mentionList, setMentionList] = useState([]);

  const textareaRef = useRef(null);
  const userListRef = useRef(null); // Reference for user list

  const fetchUsers = useDebounce(async (userName) => {
    setLoading(true);
    try {
      const response = await searchService.searchByUsername(userName);
      setUsers(response);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const getCaretCoordinates = (textLength) => {
    const textarea = textareaRef.current;
    const text = textarea.value.slice(0, textarea.selectionStart);
    const div = document.createElement("div");

    Object.assign(div.style, {
      position: "absolute",
      whiteSpace: "pre-wrap",
      wordWrap: "break-word",
      visibility: "hidden",
      top: 0,
      left: 0,
      width: `${textarea.offsetWidth}px`,
      fontSize: window.getComputedStyle(textarea).fontSize,
      fontFamily: window.getComputedStyle(textarea).fontFamily,
      lineHeight: window.getComputedStyle(textarea).lineHeight,
    });

    div.textContent = text.replace(/\n$/, "\n."); // Add a placeholder for empty lines
    textarea.parentNode.appendChild(div);

    const span = document.createElement("span");
    div.appendChild(span);
    const rect = span.getBoundingClientRect();
    div.parentNode.removeChild(div);

    // Calculate left position
    const left =
      rect.left - textarea.getBoundingClientRect().left - textLength * 8;

    // Calculate the max left position based on the width of the textarea
    const maxLeft = 250;
    console.log(left);

    // Ensure the left position does not exceed 0 (i.e., the user list will stay within the container)
    return {
      top: rect.top - textarea.getBoundingClientRect().top + textarea.scrollTop,
      left: Math.min(left, maxLeft),
    };
  };
  const extractMentions = (text) => {
    const mentionPattern = /@(\w+)/g;
    const mentions = [];
    let match;
    while ((match = mentionPattern.exec(text)) !== null) {
      mentions.push(match[1]); // Collect the username part of the mention
    }
    return mentions;
  };

  const checkIfMentionExist =  (text) =>{
    console.log(text);
    
    setMentionList(mentionList.filter(mention => content.includes("@"+mention.username+" ")))
  }
  
  // const handleInputChange = (event) => {
  //   const newContent = event.target.value;
  //   const cursorPosition = event.target.selectionStart;


  //   console.log("mentions",mentionList);
    
  //   if (newContent.length > 0) {
  //     settextIsEmpty(false);
  //   } else {
  //     settextIsEmpty(true);
  //   }
  //   if (newContent.length > maxLength) return;
  
  //   adjustTextareaHeight();
  
  //   // Detect mentions dynamically
  //   let foundMentionStart = null;
  //   for (let i = cursorPosition - 1; i >= 0; i--) {
  //     const char = newContent[i];
  //     if (char === "@") {
  //       foundMentionStart = i + 1;
  //       fetchUsers(newContent.slice(foundMentionStart, cursorPosition).trim());
  //       setShowUserList(true);
  //       const textLength = cursorPosition - foundMentionStart;
  //       setMentionPosition(getCaretCoordinates(textLength));
  //       break;
  //     } else if (/\s/.test(char)) {
  //       break;
  //     }
  //   }
  
  //   if (!foundMentionStart) {
  //     setShowUserList(false);
  //   }
  
  //   setMentionStart(foundMentionStart);
  //   setContent((prev) => ({ ...prev, content: newContent }));
  
  //   // Synchronize mentionList with mentions in the content
  //   const mentionsInContent = extractMentions(newContent);
  //   setMentionList((prevMentionList) => {
  //     // Keep existing mentions if they are complete or in progress
  //     const updatedMentionList = [...prevMentionList];
  //     mentionsInContent.forEach((username) => {
  //       const existingMention = users.find((u) => u.username === username);
  //       if (existingMention && !updatedMentionList.includes(existingMention._id)) {
  //         updatedMentionList.push(existingMention._id);
  //       }
  //     });
  //     return updatedMentionList;
  //   });
  // };
  

  const handleInputChange = (event) => {
    const newContent = event.target.value;
    const cursorPosition = event.target.selectionStart;
    checkIfMentionExist(newContent)
    console.log("men",mentionList);
    
    if (newContent.length > 0) {
      settextIsEmpty(false);
    } else {
      settextIsEmpty(true);
    }
    if (newContent.length > maxLength) return;

    adjustTextareaHeight();

    if (newContent[event.target.value.length - 1] == " ") {
      for (let i = cursorPosition - 1; i >= 0; i--) {
        const char = newContent[i];
        if (
          char === "@" &&
          newContent[i - 1] == " " &&
          cursorPosition - foundMentionStart > 0
        ) {
          foundMentionStart = i + 1;
          const response = fetchUsers(
            newContent.slice(foundMentionStart, cursorPosition).trim()
          );
          console.log(!mentionList.includes(response[0]))
          
          if (
            response.username ===
              newContent.slice(foundMentionStart, cursorPosition).trim() &&
            !mentionList.some((mention) => mention.username === response.username)
          ) {
            setMentionList((prev) => [...prev, response[0]]);
          }
          setShowUserList(true);
          const textLength = cursorPosition - foundMentionStart;
          setMentionPosition(getCaretCoordinates(textLength));
          break;
        } else if (/\s/.test(char)) {
          break;
        }
      }
    }

    let foundMentionStart = null;
    for (let i = cursorPosition - 1; i >= 0; i--) {
      const char = newContent[i];
      if (
        char === "@" &&
        newContent[i - 1] == " " &&
        cursorPosition - foundMentionStart > 0
      ) {
        foundMentionStart = i + 1;
        fetchUsers(newContent.slice(foundMentionStart, cursorPosition).trim());
        setShowUserList(true);
        const textLength = cursorPosition - foundMentionStart;
        setMentionPosition(getCaretCoordinates(textLength));
        break;
      } else if (/\s/.test(char)) {
        break;
      }
    }

    if (!foundMentionStart) {
      setShowUserList(false);
    }

    setMentionStart(foundMentionStart);
    setContent((prev) => ({ ...prev, content: newContent }));
  };

  const handleUserClick = (user) => {
    const updatedContent =
      content.slice(0, mentionStart - 1) +
      "@" +
      user.username +
      " " +
      content.slice(textareaRef.current.selectionStart);
    setContent((prev) => ({ ...prev, content: updatedContent }));
    console.log(!mentionList.includes(user))

    if (!mentionList.some((mention) => mention.username === user.username)) {
      setMentionList((prev) => [...prev, user]);
    }
    setShowUserList(false);
    console.log("men",mentionList);

    requestAnimationFrame(() => {
      const newCursorPosition = mentionStart + user.username.length + 1;
      textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
        newCursorPosition;
      textareaRef.current.focus();
    });
  };

  const handleKeyDown = (event) => {
    if (showUserList) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % users.length);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + users.length) % users.length);
      } else if (event.key === "Enter") {
        event.preventDefault();
        handleUserClick(users[selectedIndex]);
      }
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [content]);

  useEffect(() => {
    if (showUserList && userListRef.current) {
      const userListRect = userListRef.current.getBoundingClientRect();
      const screenHeight = window.innerHeight;

      // Check if the list goes out of the screen on the bottom
      if (userListRect.bottom > screenHeight) {
        setMentionPosition((prev) => ({
          ...prev,
          top: prev.top - userListRect.height - 10, // Adjust to move up
        }));
      }
    }
  }, [showUserList]);

  return (
    <div className="w-full max-w-md mx-auto relative">
      <div className="relative w-full mt-1 bg-transparent whitespace-pre-wrap break-words mb-2">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="w-full outline-none resize-none  bg-transparent  relative"
          placeholder="What's on your mind?"
          rows={1}
          style={{
            height: "auto",
            overflowY: "hidden",
            whiteSpace: "pre-wrap",
            color: "transparent", // Makes the text invisible while preserving cursor visibility
            caretColor: "black", // Ensures caret (cursor) visibility
          }}
        />
        <div
          className="pointer-events-none absolute  top-0 left-0 w-full h-full z-0"
          style={{
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
          }}
        >
          {content.split(/(@\w+)/).map((part, index) => {
            if (part.startsWith("@")) {
              return (
                <span key={index} className="text-blue-500">
                  {part}
                </span>
              );
            }
            return part; // Placeholder styling
          })}
        </div>
      </div>

      {showUserList && mentionStart !== null && (
       <ul
       ref={userListRef}
       className="absolute bg-white z-10 border right-0 overflow-y-auto max-h-48 w-fit shadow-md"
       style={{
         top: mentionPosition.top + 35, // Position dropdown below the mention
         left: Math.min(
           mentionPosition.left-6,
           window.innerWidth <= 768 ? 100 : 240 // Check viewport width to handle mobile or desktop
         ), // Adjust left dynamically to keep within the viewport
       }}
     >
        {loading ? (
          <li className="p-2 text-center max-w-56 w-44">Loading...</li>
        ) : (
          users.map((user, index) => (
            <li
              key={user.username}
              onClick={() => handleUserClick(user)}
              className={`cursor-pointer p-2 px-3 flex gap-2 max-w-56  items-center ${
                selectedIndex === index ? "bg-gray-200" : ""
              }`}
            >
              <UserImageInput
                image={user.profileImage?.originalImage[0]}
                isEditable={false}
                imageHeight={35}
              />
              <p className="max-w-full truncate line-clamp-1">{user.username}</p>
            </li>
          ))
        )}
      </ul>
      
      )}

      <div className="text-right text-gray-400 text-sm mt-2">
        {maxLength - content.length} characters remaining
      </div>
    </div>
  );
}

export default PostTextArea;
