import React from 'react';

const UserDetailsSection = ({ userDetailsList }) => {
  return (
    <div className="w-full md:max-w-lg">
      {userDetailsList.map((item, index) => (
        <div
          key={index}
          className="cursor-pointer"
          draggable
          onDragStart={(e) => handleDragStart(e, item.id)}
          onDrop={(e) => handleDrop(e, item.id)}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="flex flex-col border px-6 py-6 gap-2 mt-3">
            <div className="flex justify-between mb-3">
              <p className="text-xl font-medium">{item.title}</p>
              {item.onClick && (
                <p
                  className="text-blue-500 font-medium cursor-pointer"
                  onClick={item.onClick}
                >
                  Add
                </p>
              )}
            </div>
            {item.content && <div>{item.content}</div>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserDetailsSection;
