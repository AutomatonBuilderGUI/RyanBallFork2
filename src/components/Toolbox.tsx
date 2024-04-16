import { Tool } from '../Tool';
import ToolButton from './ToolButton';
import StateManager from '../StateManager';
import * as React from 'react';
const { useRef } = React;
import { BsArrowRight, BsCursor, BsCursorFill, BsDownload, BsNodePlus, BsNodePlusFill, BsPlusCircle, BsPlusCircleFill, BsUpload, BsZoomIn, BsZoomOut } from 'react-icons/bs';
import { TbZoomReset } from "react-icons/tb";
import { BiReset } from "react-icons/bi";
interface ToolboxProps {
    currentTool: Tool
    setCurrentTool: React.Dispatch<React.SetStateAction<Tool>>
}

export default function Toolbox(props: React.PropsWithChildren<ToolboxProps>) {
    const fileInputRef = useRef<HTMLInputElement>(null); // Create a ref for the file input

    // Function to trigger file input click event
    const handleLoadButtonClick = () => {
        fileInputRef.current?.click(); // Programmatically click the hidden file input
    };

    // react-icons faSearchPlus and faSearchMinus for zoom in and out buttons

    return (
        <div className='flex flex-col text-xl'>
            <ToolButton tool={Tool.Select} setCurrentTool={props.setCurrentTool} currentTool={props.currentTool} title="Select [S]">
                <div className='flex flex-row items-center place-content-center'>
                    {props.currentTool === Tool.Select ? <BsCursorFill /> : <BsCursor />}
                </div>
            </ToolButton>
            <ToolButton tool={Tool.States} setCurrentTool={props.setCurrentTool} currentTool={props.currentTool} title="Add States [A]">
                <div className='flex flex-row items-center place-content-center'>
                    {props.currentTool === Tool.States ? <BsPlusCircleFill /> : <BsPlusCircle />}
                </div>
            </ToolButton>
            <ToolButton tool={Tool.Transitions} setCurrentTool={props.setCurrentTool} currentTool={props.currentTool} title="Add Transitions [T]">
                <div className='flex flex-row items-center place-content-center'>
                    {props.currentTool === Tool.Transitions ? <BsNodePlusFill /> : <BsNodePlus />}
                </div>
            </ToolButton>
            <div className='grow'></div>
            <button className='rounded-full p-2 m-1 mx-2 block bg-amber-500 text-white text-center' onClick={StateManager.downloadJSON} title="Download from JSON">
                <BsDownload />
            </button>
            <input type='file' id='file-uploader' ref={fileInputRef} style={{ display: 'none' }} onChange={StateManager.uploadJSON} />
            <button className='rounded-full p-2 m-1 mx-2 block bg-amber-500 text-white text-center' onClick={handleLoadButtonClick} title="Load from JSON">
                <BsUpload />
            </button>
            {/* Reset Zoom Button */}
            <button className='rounded-full p-2 m-1 mx-2 block bg-blue-500 text-white text-center' onClick={StateManager.resetZoom} title="Reset Zoom">
                <div className='flex flex-row items-center justify-center'>
                    <TbZoomReset />
                </div>
            </button>
            {/* Center Stage Button */}
            <button className='rounded-full p-2 m-1 mx-2 block bg-green-500 text-white text-center' onClick={StateManager.centerStage} title="Center Stage">
                <div className='flex flex-row items-center justify-center'>
                    <BiReset />
                </div>
            </button>
            {/* Zoom In Button */}
            <button className='rounded-full p-2 m-1 mx-2 block bg-blue-500 text-white text-center' onClick={StateManager.zoomIn} title="Zoom In">
                <div className='flex flex-row items-center justify-center'>
                    <BsZoomIn />
                </div>
            </button>
            {/* Zoom Out Button */}
            <button className='rounded-full p-2 m-1 mx-2 block bg-blue-500 text-white text-center' onClick={StateManager.zoomOut} title="Zoom Out">
                <div className='flex flex-row items-center justify-center'>
                    <BsZoomOut />
                </div>
            </button>
        </div>
    );
}
