import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, Upload, ArrowDown, ArrowUp, Trash2, ChevronsDown, ChevronsUp, XCircle, Clipboard, ChevronDown, ChevronUp, ArrowRight, Eraser, Download } from 'lucide-react';

const FASTAViewer = () => {
    const [sequences, setSequences] = useState([]);
    const [history, setHistory] = useState([]);
    const [highlightedColumns, setHighlightedColumns] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pastedSequence, setPastedSequence] = useState('');
    const [isInputExpanded, setIsInputExpanded] = useState(true);
    const [jumpPosition, setJumpPosition] = useState('');
    const [selectionStart, setSelectionStart] = useState(null);
    const [sequenceWidth, setSequenceWidth] = useState(60);
    const fileInputRef = useRef(null);

    const demoData = `
AT2G43570 --------------------------------------------------------------------------------
AT5G05270 --------------------------------------------------------------------------------
AANG008676 -----------------------------------MSECCRYAK------------------------------------
AANG002262 --ML------------MWTGTSPRPTHWQR----------------------NGTQIFSLWCTAE---------------
AANG012888 MVQL------------VWSVESGGFISGSRSVSKQRSGCLAGAG--------QACLISSKGCISRQ-----------ELL
AANG013146 MFVLDPRHARLDFGPDLWDLL--FLPHLSNVHAWYKAECAKLAAHSARKELLDKLYQETLDDNTRQYAQYYRDRLKEDRD
AANG002615 -----------------------MFSTGS-------SVCVSSAGVDD----PLATFVEEVACRSP---------------
AANG010420 --------------------------------------------------------------------------------
AANG000786 -----------------------------------------------------------MAQTG----------------
AANG000790 --------------------------------------------------------------------------------
AANG000791 --------------------------------------------------------------------------------
AANG008702 -----------------------------------------------------------MEDTS----------------
AANG008980 -----------------------------------------------------------MARTG----------------
AANG010610 -----------------------------------------------------------MSVTT----------------
AANG010665 -----------------------------------------------------------MAANK----------------
AANG010667 --------------------------------------------------------------------------------
AANG010710 -----------------------MLSH-----------CFA-----------------YQAVTAPC------------LW`;

    const loadDemo = () => {
        const parsedSequences = demoData.trim().split('\n').map(line => {
            const [id, sequence] = line.split(/\s+/);
            return { id, sequence };
        });
        setSequences(parsedSequences);
        resetState();
        setIsInputExpanded(false);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                const parsedSequences = parseFasta(content);
                setSequences(parsedSequences);
                resetState();
                setIsInputExpanded(false);
            };
            reader.readAsText(file);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const resetState = () => {
        setCurrentPage(0);
        setSearchResults([]);
        setSearchTerm('');
        setHighlightedColumns([]);
        setPastedSequence('');
    };

    const addToHistory = (action) => {
        setHistory(prev => [...prev, action]);
    };

    const undo = () => {
        if (history.length > 0) {
            const lastAction = history[history.length - 1];
            // Implement the reverse of the last action
            // This is a simplified example, you'll need to implement the actual undo logic
            if (lastAction.type === 'setSequences') {
                setSequences(lastAction.prevValue);
            }
            // Add more action types as needed

            setHistory(prev => prev.slice(0, -1));
        }
    };
    const deleteSelectedColumns = useCallback(() => {
        if (highlightedColumns.length === 0) {
            alert('No columns selected. Please highlight columns to delete.');
            return;
        }

        setSequences(prevSequences => {
            const newSequences = prevSequences.map(seq => {
                let newSequence = '';
                for (let i = 0; i < seq.sequence.length; i++) {
                    if (!highlightedColumns.includes(i)) {
                        newSequence += seq.sequence[i];
                    }
                }
                return { ...seq, sequence: newSequence };
            });

            addToHistory({
                type: 'deleteColumns',
                columns: highlightedColumns,
                prevSequences: prevSequences
            });

            return newSequences;
        });

        setHighlightedColumns([]);
    }, [highlightedColumns, addToHistory]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.key === 'z') {
                event.preventDefault();
                undo();
            }
            if (event.key === 'Delete') {
                event.preventDefault();
                deleteSelectedColumns();
            }
        };

        const handlePaste = (event) => {
            if (!isInputExpanded && event.ctrlKey && event.key === 'v') {
                event.preventDefault();
                const pastedText = event.clipboardData.getData('text');
                setSearchTerm(prev => prev + pastedText);
            } else {
                const pastedText = event.clipboardData.getData('text');
                setPastedSequence(prev => prev + pastedText);
                event.preventDefault();
            }
        };

        const handleKeyUp = (event) => {
            if (event.key === 'Shift') {
                setSelectionStart(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('paste', handlePaste);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('paste', handlePaste);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [history, deleteSelectedColumns, undo, isInputExpanded]);

    const handlePasteSubmit = () => {
        const parsedSequences = parseFasta(pastedSequence);
        setSequences(parsedSequences);
        resetState();
        setIsInputExpanded(false);
    };

    const clearHighlights = () => {
        setHighlightedColumns([]);
        setSearchResults([]);
    };


    const parseFasta = (fastaContent) => {
        const lines = fastaContent.split('\n');
        const sequences = [];
        let currentId = '';
        let currentSequence = '';

        lines.forEach(line => {
            line = line.trim();
            if (line.startsWith('>')) {
                if (currentId) {
                    sequences.push({ id: currentId, sequence: currentSequence });
                }
                currentId = line.substring(1);
                currentSequence = '';
            } else if (line) {
                currentSequence += line;
            }
        });

        if (currentId) {
            sequences.push({ id: currentId, sequence: currentSequence });
        }

        return sequences;
    };

    const getPageCount = () => Math.ceil(sequences[0]?.sequence.length / sequenceWidth) || 1;

    const handleJumpToPosition = () => {
        const position = parseInt(jumpPosition, 10);
        if (isNaN(position) || position < 1 || position > sequences[0]?.sequence.length) {
            alert('Invalid position. Please enter a number within the sequence range.');
            return;
        }
        const newPage = Math.floor((position - 1) / sequenceWidth);
        setCurrentPage(newPage);
        setJumpPosition('');
    };

    const handleDragStart = (e, index) => {
        e.dataTransfer.setData('text/plain', index);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, targetIndex) => {
        e.preventDefault();
        const sourceIndex = parseInt(e.dataTransfer.getData('text'), 10);
        const newSequences = [...sequences];
        const [removed] = newSequences.splice(sourceIndex, 1);
        newSequences.splice(targetIndex, 0, removed);
        setSequences(newSequences);
    };

    const toggleHighlight = (columnIndex, isShiftKey = false) => {
        setHighlightedColumns(prev => {
            if (isShiftKey && selectionStart !== null) {
                const start = Math.min(selectionStart, columnIndex);
                const end = Math.max(selectionStart, columnIndex);
                const newSelection = Array.from({ length: end - start + 1 }, (_, i) => start + i);
                return [...new Set([...prev, ...newSelection])];
            } else {
                return prev.includes(columnIndex)
                    ? prev.filter(col => col !== columnIndex)
                    : [...prev, columnIndex];
            }
        });
    };

    const handleColumnClick = (columnIndex, isShiftKey) => {
        if (isShiftKey) {
            if (selectionStart === null) {
                setSelectionStart(columnIndex);
            }
            toggleHighlight(columnIndex, true);
        } else {
            setSelectionStart(columnIndex);
            toggleHighlight(columnIndex);
        }
    };

    const handleSearch = () => {
        const results = sequences.map(seq => {
            const matches = [];
            let sequenceIndex = 0;
            let searchIndex = 0;
            let matchStart = -1;

            while (sequenceIndex < seq.sequence.length) {
                if (seq.sequence[sequenceIndex] === searchTerm[searchIndex] || seq.sequence[sequenceIndex] === '-') {
                    if (matchStart === -1) matchStart = sequenceIndex;
                    if (seq.sequence[sequenceIndex] !== '-') searchIndex++;
                    if (searchIndex === searchTerm.length) {
                        matches.push([matchStart, sequenceIndex + 1]);
                        searchIndex = 0;
                        matchStart = -1;
                    }
                } else {
                    searchIndex = 0;
                    matchStart = -1;
                }
                sequenceIndex++;
            }

            return { id: seq.id, matches };
        }).filter(result => result.matches.length > 0);

        setSearchResults(results);
    };

    const generateFastaContent = () => {
        return sequences.map(seq => `>${seq.id}\n${seq.sequence}`).join('\n');
    };

    const downloadFasta = () => {
        const content = generateFastaContent();
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'sequences.fasta';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const moveRowUp = (index) => {
        if (index > 0) {
            setSequences(prev => {
                const newSequences = [...prev];
                [newSequences[index - 1], newSequences[index]] = [newSequences[index], newSequences[index - 1]];
                return newSequences;
            });
        }
    };

    const moveRowDown = (index) => {
        if (index < sequences.length - 1) {
            setSequences(prev => {
                const newSequences = [...prev];
                [newSequences[index], newSequences[index + 1]] = [newSequences[index + 1], newSequences[index]];
                return newSequences;
            });
        }
    };

    const deleteRow = (index) => {
        setSequences(prev => prev.filter((_, i) => i !== index));
    };

    const removeRowToLast = (index) => {
        setSequences(prev => {
            const newSequences = [...prev];
            const [removed] = newSequences.splice(index, 1);
            newSequences.push(removed);
            return newSequences;
        });
    };

    const moveRowToFirst = (index) => {
        setSequences(prev => {
            const newSequences = [...prev];
            const [removed] = newSequences.splice(index, 1);
            newSequences.unshift(removed);
            return newSequences;
        });
    };


    const calculateActualPosition = (sequence, index) => {
        return sequence.slice(0, index).replace(/-/g, '').length + 1;
    };

    const renderSequence = (sequence, id) => {
        const start = currentPage * sequenceWidth;
        const end = start + sequenceWidth;
        const displayedSequence = sequence.slice(start, end);

        const result = searchResults.find(r => r.id === id);
        const highlightRanges = result ? result.matches : [];

        return displayedSequence.split('').map((char, index) => {
            const absoluteIndex = start + index;
            const isHighlighted = highlightRanges.some(([start, end]) => absoluteIndex >= start && absoluteIndex < end);
            const actualPosition = calculateActualPosition(sequence, absoluteIndex);
            return (
                <td
                    key={index}
                    className={`border px-1 py-1 font-mono
                    ${highlightedColumns.includes(absoluteIndex) ? 'bg-yellow-200' : ''}
                    ${isHighlighted ? 'bg-green-300' : ''}`}
                    onClick={(e) => handleColumnClick(absoluteIndex, e.shiftKey)}
                    title={char !== '-' ? `Actual position: ${actualPosition}` : 'Gap'}
                >
                    {char}
                </td>
            );
        });
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">FASTA Sequence Viewer and Editor</h2>
            <div className="mb-4">
                <button
                    onClick={() => setIsInputExpanded(!isInputExpanded)}
                    className="w-full bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-lg flex justify-between items-center"
                >
                    <span className="font-semibold">Input Options</span>
                    {isInputExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
            </div>
            <div className="mb-4 flex flex-wrap items-center gap-4">
                <div className="flex-grow max-w-md">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                            placeholder="Search sequence"
                            className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button onClick={handleSearch} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600">
                            <Search size={20} />
                        </button>
                    </div>
                </div>
            </div>
            {isInputExpanded && (
                <div className="mb-6 space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <button onClick={loadDemo} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                            <span className="mr-2">📊</span>Load Demo
                        </button>
                        <label className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md cursor-pointer transition duration-300 ease-in-out transform hover:scale-105">
                            <input
                                type="file"
                                onChange={handleFileUpload}
                                className="hidden"
                                accept=".fasta,.fa,.txt"
                                ref={fileInputRef}
                            />
                            <Upload size={20} className="inline mr-2" />
                            Upload FASTA
                        </label>
                    </div>
                    <div>
                        <textarea
                            value={pastedSequence}
                            onChange={(e) => setPastedSequence(e.target.value)}
                            placeholder="Paste your FASTA sequence here..."
                            className="w-full h-32 p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button 
                            onClick={handlePasteSubmit}
                            className="mt-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            <Clipboard size={20} className="inline mr-2" />
                            Visualize Pasted Sequence
                        </button>
                    </div>
                </div>
            )}
            <div className="mb-4 flex flex-wrap items-center gap-4 justify-center">
                <button onClick={clearHighlights} className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                    <XCircle size={20} className="inline mr-2" />
                    Clear Highlights
                </button>
                <button onClick={deleteSelectedColumns} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                    <Eraser size={20} className="inline mr-2" />
                    Delete Selected Columns
                </button>
                <div className="flex items-center space-x-2">
                    <input
                        type="number"
                        value={jumpPosition}
                        onChange={(e) => setJumpPosition(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleJumpToPosition();
                            }
                        }}
                        placeholder="Jump to position"
                        className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleJumpToPosition}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        <ArrowRight size={20} className="inline mr-2" />
                        Jump
                    </button>
                </div>
                <button
                    onClick={downloadFasta}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    disabled={sequences.length === 0}
                >
                    <Download size={20} className="inline mr-2" />
                    Export FASTA
                </button>
                <div className="flex items-center space-x-2">
                    <label htmlFor="sequenceWidth" className="font-medium">Sequence Width:</label>
                    <input
                        id="sequenceWidth"
                        type="number"
                        value={sequenceWidth}
                        onChange={(e) => {
                            const newWidth = parseInt(e.target.value, 10);
                            if (newWidth > 0) {
                                setSequenceWidth(newWidth);
                                setCurrentPage(0); // Reset to first page when width changes
                            }
                        }}
                        className="border border-gray-300 rounded-lg py-2 px-4 w-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                    />
                </div>
            </div>
            {sequences.length > 0 ? (
                <>
                <div className="mb-6 flex justify-center items-center">
                    <div className="flex items-center bg-gray-100 rounded-lg shadow-inner p-1">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                disabled={currentPage === 0}
                                className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <span className="px-4 font-medium">Page {currentPage + 1} of {getPageCount()}</span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(getPageCount() - 1, prev + 1))}
                                disabled={currentPage === getPageCount() - 1}
                                className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="border-collapse">
                            <thead>
                                <tr>
                                    <th className="border px-2 py-1 font-mono bg-gray-200">Actions</th>
                                    <th className="border px-2 py-1 font-mono bg-gray-200 whitespace-nowrap" style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>ID</th>
                                    {[...Array(sequenceWidth)].map((_, index) => (
                                        <th
                                            key={index}
                                            className="border px-1 py-1 font-mono bg-gray-200"
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, index)}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                const sourceIndex = parseInt(e.dataTransfer.getData('text'), 10);
                                                const newSequences = sequences.map(seq => {
                                                    const chars = seq.sequence.split('');
                                                    const [removed] = chars.splice(sourceIndex, 1);
                                                    chars.splice(index, 0, removed);
                                                    return { ...seq, sequence: chars.join('') };
                                                });
                                                setSequences(newSequences);
                                            }}
                                        >
                                            {index + currentPage * sequenceWidth + 1}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {sequences.map((seq, rowIndex) => (
                                    <tr
                                        key={seq.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, rowIndex)}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, rowIndex)}
                                        className="hover:bg-gray-100"
                                    >
                                        <td className="border px-2 py-1">
                                            <div className="flex space-x-1">
                                            <button 
                                                    onClick={() => moveRowToFirst(rowIndex)} 
                                                    className="text-green-500 hover:bg-green-100 p-1 rounded"
                                                    title="Move row to first"
                                                >
                                                    <ChevronsUp size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => moveRowUp(rowIndex)} 
                                                    className="text-blue-500 hover:bg-blue-100 p-1 rounded"
                                                    title="Move row up"
                                                    disabled={rowIndex === 0}
                                                >
                                                    <ArrowUp size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => moveRowDown(rowIndex)} 
                                                    className="text-blue-500 hover:bg-blue-100 p-1 rounded"
                                                    title="Move row down"
                                                    disabled={rowIndex === sequences.length - 1}
                                                >
                                                    <ArrowDown size={16} />
                                                </button>

                                                <button 
                                                    onClick={() => removeRowToLast(rowIndex)} 
                                                    className="text-yellow-500 hover:bg-yellow-100 p-1 rounded"
                                                    title="Move row to last"
                                                >
                                                    <ChevronsDown size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => deleteRow(rowIndex)} 
                                                    className="text-red-500 hover:bg-red-100 p-1 rounded"
                                                    title="Delete row"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                        <td
                                            className="border px-2 py-1 font-mono whitespace-nowrap"
                                            style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                            title={seq.id}
                                        >
                                            {seq.id}
                                        </td>
                                        {renderSequence(seq.sequence, seq.id)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <p className="text-center text-gray-500">No sequences loaded. Please load demo or upload a FASTA file.</p>
            )}
            {searchResults.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-xl font-bold mb-2">Search Results:</h3>
                    <ul>
                        {searchResults.map((result, index) => (
                            <li key={index} className="mb-1">{result.id} (Matches: {result.matches.length})</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default FASTAViewer;