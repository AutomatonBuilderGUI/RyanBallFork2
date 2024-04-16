import StateManager from './StateManager';
import { Tool } from './Tool';
import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import NodeView from './components/NodeView';
import Toolbox from './components/Toolbox';
import FloatingPanel from './components/FloatingPanel';
import SelectableObject from './SelectableObject';
import DetailsBox from './components/DetailsBox/DetailsBox';
import ModalWindow, { ClosableModalWindow } from './components/ModalWindow';
import ConfigureAutomatonWindow from './components/ConfigureAutomatonWindow';
import { BsGearFill, BsMoonFill, BsCheck2Circle } from 'react-icons/bs';
import TestStringWindow from './components/TestStringWindow';
import InformationBox, { InformationBoxType } from './components/InformationBox';
import { testStringOnAutomata } from './components/TestStringOnAutomata';
import {  } from './components/TestStringWindow';

function App() {
    const [currentTool, setCurrentTool] = useState(Tool.States);
    const [selectedObjects, setSelectedObjects] = useState(new Array<SelectableObject>());
    const [startNode, setStartNode] = useState(StateManager.startNode);
    const [isLabelUnique, setIsLabelUnique] = useState(true);

    //Solution from this stackoverflow page: https://stackoverflow.com/questions/9626059/window-onbeforeunload-in-chrome-what-is-the-most-recent-fix
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
          e.preventDefault();
          //using on chrome may require return value to be set
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
      }, []);


    // Switch current tool when keys pressed
    useEffect(() => {
        StateManager.setSelectedObjects = setSelectedObjects;
        addEventListener('keydown', (ev: KeyboardEvent) => {
            // Ignore keyboard shortcuts if user is in a text box.
            // Solution from https://stackoverflow.com/a/4575309
            const n = document.activeElement.nodeName;
            if (n == 'TEXTAREA' || n == 'INPUT') {
                return;
            }

            if (ev.code === "KeyA") {
                setCurrentTool(Tool.States);
            }
            else if (ev.code === "KeyT") {
                setCurrentTool(Tool.Transitions);
            }
            else if (ev.code === "KeyS") {
                setCurrentTool(Tool.Select);
            }

            else if (ev.code === "KeyW") {
                console.log(StateManager.toJSON());
            }
        });
    }, []);

    useEffect(() => {
        StateManager.currentTool = currentTool;
    }, [currentTool]);

    useEffect(() => {
        StateManager.selectedObjects = selectedObjects;
    }, [selectedObjects]);

    useEffect(() => {
        StateManager.startNode = startNode;
    }, [startNode]);

    const emptyStringToken = StateManager.alphabet.some(token => token.symbol.trim() === '');
    const isAutomatonValid = 

    useEffect(() => {
        const unique = StateManager.areAllLabelsUnique();
        setIsLabelUnique(unique);
    }, [selectedObjects]);

    const [configWindowOpen, setConfigWindowOpen] = useState(false);
    const openConfigWindow = () => { setConfigWindowOpen(true); };
    const closeConfigWindow = () => { setConfigWindowOpen(false); };

    const [useDarkMode, setDarkMode] = useState(false);
    const toggleDarkMode = () => { setDarkMode(!useDarkMode); };
    useEffect(() => {
        StateManager.useDarkMode = useDarkMode;
    }, [useDarkMode]);

    return (
        <div className={useDarkMode ? 'dark' : ''}>
            <NodeView />
            <div className='flex flex-row h-screen text-center'>
                <div>
                    <FloatingPanel heightPolicy='min' style={{ width: '300px' }}>
                        <DetailsBox
                            selection={selectedObjects}
                            startNode={startNode}
                            setStartNode={setStartNode}
                        />

                        {/* Example error message boxes commented out */}
                        {/*
                        <InformationBox infoBoxType={InformationBoxType.Error}>
                            State "q0" has multiple transitions for token "a"
                        </InformationBox>
                        <InformationBox infoBoxType={InformationBoxType.Error}>
                            State "q0" has no transition for token "b"
                        </InformationBox>
                        <InformationBox infoBoxType={InformationBoxType.Error}>
                            Transitions on empty string (ε) not allowed in DFA
                        </InformationBox>
                        <InformationBox infoBoxType={InformationBoxType.Error}>
                            Alphabet needs at least one token
                        </InformationBox>
                        <InformationBox infoBoxType={InformationBoxType.Error}>
                            Token "c" is repeated in alphabet
                        </InformationBox>
                        <InformationBox infoBoxType={InformationBoxType.Warning}>
                            State "q3" is inaccessible
                        </InformationBox>
                        <InformationBox infoBoxType={InformationBoxType.Warning}>
                            Accept state "q4" is inaccessible; automaton will always reject
                        </InformationBox>
                        */}

                        <TestStringWindow />
                        {!isLabelUnique && (
                            <InformationBox infoBoxType={InformationBoxType.Error}>
                                Duplicate state labels detected. Each state must have a unique label.
                            </InformationBox>
                        )}
                        {emptyStringToken && (
                            <InformationBox infoBoxType={InformationBoxType.Error}>
                                Invalid token: Empty string detected.
                            </InformationBox>
                        )}
                        
                        <div className="flex flex-col items-center mt-4">
                            <button
                                className="rounded-full p-2 m-1 mx-2 block bg-amber-500 text-white text-center"
                                onClick={openConfigWindow}
                            >
                                <div className='flex flex-row items-center place-content-center mx-2'>
                                    <BsGearFill className='mr-1' />
                                    Configure Automaton
                                </div>
                            </button>
                            <button
                                className="rounded-full p-2 m-1 mx-2 block bg-gray-500 text-white text-center"
                                onClick={toggleDarkMode}
                            >
                                <div className='flex flex-row items-center place-content-center mx-2'>
                                    <BsMoonFill className='mr-1' />
                                    Dark Mode
                                </div>
                            </button>
                        </div>
                    </FloatingPanel>
                </div>

                <FloatingPanel heightPolicy='min'>
                    <Toolbox currentTool={currentTool} setCurrentTool={setCurrentTool} />
                </FloatingPanel>
            </div>
            {configWindowOpen && <ClosableModalWindow title='Configure Automaton' close={closeConfigWindow}><ConfigureAutomatonWindow /></ClosableModalWindow>}
        </div>
    );
}

const domNode = document.getElementById('react-root');
const root = createRoot(domNode);
root.render(<App />);
