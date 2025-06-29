// 函数：像素转换为毫米
function pxToMm(px) {
    // 1英寸 = 25.4毫米, 96像素 = 1英寸
    return (px * 25.4) / 96;
}

// 函数：毫米转换为像素
function mmToPx(mm) {
    // 1英寸 = 25.4毫米, 96像素 = 1英寸
    return (mm * 96) / 25.4;
}

// 函数：输出div的样式信息
function logDivStyle(element) {
    const rect = element.getBoundingClientRect();
    const sheet = document.querySelector('.sheet');
    const sheetRect = sheet.getBoundingClientRect();
    
    // 计算相对于sheet的位置
    const relativeLeft = rect.left - sheetRect.left;
    const relativeTop = rect.top - sheetRect.top;
    
    console.log('Div样式信息:', {
        position: 'absolute',
        top: pxToMm(relativeTop).toFixed(2) + 'mm',
        left: pxToMm(relativeLeft).toFixed(2) + 'mm',
        width: pxToMm(rect.width).toFixed(2) + 'mm',
        height: pxToMm(rect.height).toFixed(2) + 'mm',
        topPx: relativeTop.toFixed(2) + 'px',
        leftPx: relativeLeft.toFixed(2) + 'px',
        widthPx: rect.width.toFixed(2) + 'px',
        heightPx: rect.height.toFixed(2) + 'px'
    });
}

// 函数：自适应文字大小到div尺寸
function adjustTextSize(element) {
    const text = element.textContent;
    if (!text || text.trim() === '') return;
    
    const divWidth = element.offsetWidth;
    const divHeight = element.offsetHeight;
    
    // 设置初始字体大小
    let fontSize = Math.min(divWidth, divHeight) / 2;
    element.style.fontSize = fontSize + 'px';
    
    // 创建临时元素来测量文字尺寸
    const tempSpan = document.createElement('span');
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.position = 'absolute';
    tempSpan.style.whiteSpace = 'nowrap';
    tempSpan.style.fontSize = fontSize + 'px';
    tempSpan.textContent = text;
    document.body.appendChild(tempSpan);
    
    // 调整字体大小直到文字适合div
    let iterations = 0;
    const maxIterations = 50; // 防止无限循环
    
    while (iterations < maxIterations) {
        const textWidth = tempSpan.offsetWidth;
        const textHeight = tempSpan.offsetHeight;
        
        // 检查文字是否超出div边界（留10px边距）
        const margin = 10;
        if (textWidth <= divWidth - margin && textHeight <= divHeight - margin) {
            // 如果文字还有空间，尝试增大字体
            if (textWidth < divWidth - margin - 20 && textHeight < divHeight - margin - 10 && fontSize < 100) {
                fontSize += 1;
                tempSpan.style.fontSize = fontSize + 'px';
            } else {
                break; // 找到合适的大小
            }
        } else {
            // 文字超出边界，减小字体
            fontSize -= 1;
            if (fontSize < 8) {
                fontSize = 8; // 最小字体大小
                break;
            }
            tempSpan.style.fontSize = fontSize + 'px';
        }
        iterations++;
    }
    
    // 清理临时元素
    document.body.removeChild(tempSpan);
    
    // 应用最终字体大小
    element.style.fontSize = fontSize + 'px';
    
    console.log(`文字 "${text}" 自适应字体大小: ${fontSize}px`);
}

// 动态加载 interact.js
const script = document.createElement('script');
script.src = 'https://unpkg.com/interactjs/dist/interact.min.js';
script.onload = function() {
    console.log('Interact.js 库已加载成功');
    initializeInteract();
};
script.onerror = function() {
    console.error('Interact.js 库加载失败');
};
document.head.appendChild(script);

function initializeInteract() {
    let isShiftPressed = false;
    let isCtrlPressed = false;
    
    // 监听键盘事件
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Shift') {
            isShiftPressed = true;
            updateInteractionMode();
        }
        if (event.key === 'Control') {
            isCtrlPressed = true;
            updateInteractionMode();
        }
    });
    
    document.addEventListener('keyup', function(event) {
        if (event.key === 'Shift') {
            isShiftPressed = false;
            updateInteractionMode();
        }
        if (event.key === 'Control') {
            isCtrlPressed = false;
            updateInteractionMode();
        }
    });
    
    // 更新交互模式
    function updateInteractionMode() {
        const divs = document.querySelectorAll('.positioned-div');
        divs.forEach(div => {
            if (isShiftPressed) {
                // Shift按下：启用调整大小，禁用拖拽
                interact(div).draggable(false);
                interact(div).resizable({
                    edges: { left: true, right: true, bottom: true, top: true },
                    modifiers: [
                        interact.modifiers.restrictEdges({
                            outer: '.sheet'
                        }),
                        interact.modifiers.restrictSize({
                            min: { width: 20, height: 20 }
                        })
                    ],
                    listeners: {
                        move(event) {
                            const target = event.target;
                            let x = (parseFloat(target.getAttribute('data-x')) || 0);
                            let y = (parseFloat(target.getAttribute('data-y')) || 0);

                            target.style.width = event.rect.width + 'px';
                            target.style.height = event.rect.height + 'px';

                            x += event.deltaRect.left;
                            y += event.deltaRect.top;

                            target.style.transform = `translate(${x}px, ${y}px)`;
                            target.setAttribute('data-x', x);
                            target.setAttribute('data-y', y);
                        },
                        end(event) {
                            adjustTextSize(event.target);
                            logDivStyle(event.target);
                        }
                    }
                });
                document.body.classList.remove('drag-mode');
                document.body.classList.add('resize-mode');
            } else if (isCtrlPressed) {
                // Ctrl按下：启用拖拽，禁用调整大小
                interact(div).resizable(false);
                interact(div).draggable({
                    modifiers: [
                        interact.modifiers.restrictRect({
                            restriction: '.sheet'
                        })
                    ],
                    listeners: {
                        move(event) {
                            const target = event.target;
                            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                            target.style.transform = `translate(${x}px, ${y}px)`;
                            target.setAttribute('data-x', x);
                            target.setAttribute('data-y', y);
                        },
                        end(event) {
                            logDivStyle(event.target);
                        }
                    }
                });
                div.style.cursor = 'move';
                document.body.classList.remove('resize-mode');
                document.body.classList.add('drag-mode');
            } else {
                // 默认状态：禁用所有交互
                interact(div).draggable(false);
                interact(div).resizable(false);
                div.style.cursor = 'default';
                document.body.classList.remove('resize-mode', 'drag-mode');
            }
        });
    }
    
    // 添加双击编辑文字和删除功能
    function addTextEditingFeature() {
        document.addEventListener('dblclick', function(event) {
            if (event.target.classList.contains('positioned-div')) {
                // 在双击时实时检查Ctrl键状态，而不是依赖全局变量
                const isCtrlCurrentlyPressed = event.ctrlKey || event.metaKey;
                
                if (isCtrlCurrentlyPressed) {
                    // Ctrl + 双击：删除div
                    deleteDivWithConfirmation(event.target);
                } else {
                    // 普通双击：编辑文字
                    editDivText(event.target);
                }
                event.preventDefault();
                event.stopPropagation();
            }
        });
    }
    
    // 删除div的函数（带确认）
    function deleteDivWithConfirmation(div) {
        const text = div.textContent || 'New Div';
        const confirmDelete = confirm(`确定要删除div "${text}" 吗？`);
        
        if (confirmDelete) {
            // 添加删除动画
            div.style.transition = 'all 0.3s ease';
            div.style.transform = div.style.transform + ' scale(0)';
            div.style.opacity = '0';
            
            // 300ms后实际删除元素
            setTimeout(() => {
                if (div.parentNode) {
                    div.parentNode.removeChild(div);
                    console.log(`已删除div: "${text}"`);
                }
            }, 300);
        }
    }
    
    // 编辑div文字的函数
    function editDivText(div) {
        const currentText = div.textContent;
        
        // 创建输入框
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        input.style.position = 'absolute';
        input.style.width = div.offsetWidth - 10 + 'px';
        input.style.height = '20px';
        input.style.border = '2px solid #007acc';
        input.style.fontSize = '10px';
        input.style.textAlign = 'center';
        input.style.background = 'white';
        input.style.zIndex = '1000';
        
        // 计算输入框位置
        const rect = div.getBoundingClientRect();
        const sheet = document.querySelector('.sheet');
        const sheetRect = sheet.getBoundingClientRect();
        
        input.style.left = (rect.left - sheetRect.left + 5) + 'px';
        input.style.top = (rect.top - sheetRect.top + rect.height/2 - 10) + 'px';
        
        // 添加到sheet中
        sheet.appendChild(input);
        
        // 选中输入框内容
        input.focus();
        input.select();
        
        // 处理输入完成
        function finishEditing() {
            const newText = input.value.trim();
            if (newText) {
                div.textContent = newText;
                adjustTextSize(div);
            }
            sheet.removeChild(input);
        }
        
        // 监听事件
        input.addEventListener('blur', finishEditing);
        input.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                finishEditing();
            }
            if (event.key === 'Escape') {
                sheet.removeChild(input);
            }
            // 阻止事件冒泡，避免触发键盘快捷键
            event.stopPropagation();
        });
    }
    
    // 初始化所有现有div
    updateInteractionMode();
    addTextEditingFeature();

    // 双击创建新div（只在sheet空白区域）
    document.querySelector('.sheet').addEventListener('dblclick', function(event) {
        // 只有在点击空白区域时才创建新div
        if (!event.target.classList.contains('positioned-div')) {
            createNewDiv(event.offsetX, event.offsetY);
        }
    });
    
    // 创建新div的函数
    function createNewDiv(x, y) {
        const newDiv = document.createElement('div');
        newDiv.className = 'positioned-div';
        newDiv.style.position = 'absolute';
        newDiv.style.width = '30mm';
        newDiv.style.height = '15mm';
        newDiv.style.cursor = 'default';
        
        // 计算div的像素尺寸，以便将鼠标位置居中
        const widthPx = mmToPx(30);  // 将30mm转换为像素
        const heightPx = mmToPx(15); // 将15mm转换为像素
        
        // 调整位置，使div以鼠标点击位置为中心
        const centerX = x - widthPx / 2;
        const centerY = y - heightPx / 2;
        
        newDiv.setAttribute('data-x', centerX);
        newDiv.setAttribute('data-y', centerY);
        newDiv.style.transform = `translate(${centerX}px, ${centerY}px)`;
        newDiv.textContent = 'New Div';
        newDiv.style.display = 'flex';
        newDiv.style.alignItems = 'center';
        newDiv.style.justifyContent = 'center';
        
        document.querySelector('.sheet').appendChild(newDiv);
        
        // 自适应文字大小
        adjustTextSize(newDiv);
        
        // 新div默认不启用任何交互，等待用户按键
        interact(newDiv).draggable(false);
        interact(newDiv).resizable(false);
        
        console.log('创建了新的div:');
        logDivStyle(newDiv);
    }

    // 输出现有div的初始样式
    const existingDiv = document.querySelector('.positioned-div');
    if (existingDiv) {
        console.log('现有div的初始样式:');
        logDivStyle(existingDiv);
        adjustTextSize(existingDiv);
    }
}

console.log('使用说明:');
console.log('1. 默认状态：div不可交互，半透明显示');
console.log('2. 按住Ctrl键：启用拖拽模式（绿色边框）');
console.log('3. 按住Shift键：启用调整大小模式（蓝色边框）');
console.log('4. 双击div：编辑文字内容（文字会自动适应div大小）');
console.log('5. Ctrl + 双击div：删除div（有确认提示）');
console.log('6. 双击空白区域：创建新div');
console.log('7. 每次操作后会在控制台输出div的样式信息');
console.log('8. 文字大小会自动适应div的宽度和高度');